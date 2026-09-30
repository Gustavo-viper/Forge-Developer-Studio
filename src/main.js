const {app, BrowserWindow, ipcMain, dialog, shell} = require("electron");
const path = require("path");
const fs = require("fs");
const {exec, spawn} = require("child_process");

let win;
function createWindow(){
  win = new BrowserWindow({
    width: 1440, height: 900, minWidth: 1050, minHeight: 650,
    backgroundColor: "#0b0f14",
    webPreferences: { preload: path.join(__dirname,"preload.js"), contextIsolation:true, nodeIntegration:false }
  });
  win.loadFile(path.join(__dirname,"index.html"));
}
app.whenReady().then(createWindow);
app.on("window-all-closed",()=>{ if(process.platform!=="darwin") app.quit(); });

ipcMain.handle("select-folder", async ()=>{
  const r=await dialog.showOpenDialog(win,{properties:["openDirectory","createDirectory"]});
  return r.canceled ? null : r.filePaths[0];
});
ipcMain.handle("select-file", async ()=>{
  const r=await dialog.showOpenDialog(win,{properties:["openFile"]});
  return r.canceled ? null : r.filePaths[0];
});
ipcMain.handle("read-file", async (_,file)=>{
  try{return {ok:true,content:fs.readFileSync(file,"utf8")}}catch(e){return {ok:false,error:e.message}}
});
ipcMain.handle("write-file", async (_,file,content)=>{
  try{fs.writeFileSync(file,content,"utf8");return {ok:true}}catch(e){return {ok:false,error:e.message}}
});
ipcMain.handle("list-directory", async (_,dir)=>{
  try{return {ok:true,items:fs.readdirSync(dir,{withFileTypes:true}).map(x=>({name:x.name,dir:x.isDirectory()}))}}
  catch(e){return {ok:false,error:e.message}}
});
ipcMain.handle("open-path", async (_,p)=>{await shell.openPath(p);return true;});
ipcMain.handle("run-command", async (_,cmd,cwd)=>{
  return new Promise(resolve=>{
    const child=exec(cmd,{cwd,windowsHide:true,maxBuffer:1024*1024*8},(error,stdout,stderr)=>{
      resolve({code:error?.code ?? 0,stdout,stderr,error:error?.message||""});
    });
  });
});
ipcMain.handle("create-project", async (_,root,name,type)=>{
  try{
    const dir=path.join(root,name.replace(/[<>:"/\\|?*]/g,"-"));
    fs.mkdirSync(dir,{recursive:true});
    const starter = type==="web" ?
`<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name}</title><link rel="stylesheet" href="style.css"></head><body><h1>${name}</h1><script src="app.js"></script></body></html>` :
`// ${name}\\n// Projeto ${type}\\nconsole.log("Forge Developer Studio");\\n`;
    fs.writeFileSync(path.join(dir,type==="web"?"index.html":"main.js"),starter);
    if(type==="web") fs.writeFileSync(path.join(dir,"style.css"),"body{font-family:Arial;background:#0b0f14;color:#fff;padding:40px}\\n");
    fs.writeFileSync(path.join(dir,"README.md"),`# ${name}\\nCriado pelo Forge Developer Studio.\\n`);
    return {ok:true,dir};
  }catch(e){return {ok:false,error:e.message}}
});