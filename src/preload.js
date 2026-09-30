const {contextBridge,ipcRenderer}=require("electron");
contextBridge.exposeInMainWorld("forge",{
  selectFolder:()=>ipcRenderer.invoke("select-folder"),
  selectFile:()=>ipcRenderer.invoke("select-file"),
  readFile:p=>ipcRenderer.invoke("read-file",p),
  writeFile:(p,c)=>ipcRenderer.invoke("write-file",p,c),
  listDirectory:p=>ipcRenderer.invoke("list-directory",p),
  openPath:p=>ipcRenderer.invoke("open-path",p),
  runCommand:(c,w)=>ipcRenderer.invoke("run-command",c,w),
  createProject:(r,n,t)=>ipcRenderer.invoke("create-project",r,n,t)
});