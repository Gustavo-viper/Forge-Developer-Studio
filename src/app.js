const $=s=>document.querySelector(s);
let root=null, currentProject=null, currentFile=null;
const projects=JSON.parse(localStorage.getItem("forgeProjects")||"[]");
function saveProjects(){localStorage.setItem("forgeProjects",JSON.stringify(projects));renderProjects()}
function showPage(id){document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));$("#"+id).classList.add("active");document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("active",x.dataset.page===id))}
function renderProjects(){const box=$("#projectList");box.innerHTML="";$("#projectCount").textContent=projects.length;if(!projects.length){box.innerHTML='<div class="card big"><b>Nenhum projeto</b><span>Crie seu primeiro projeto para começar.</span></div>';return}projects.forEach((p,i)=>{const d=document.createElement("div");d.className="project";d.innerHTML=`<b>${p.name}</b><small>${p.type} · ${p.dir}</small><button data-i="${i}">Abrir</button>`;d.querySelector("button").onclick=()=>openProject(p);box.appendChild(d)})}
async function openProject(p){currentProject=p;$("#projectLabel").textContent=p.name;showPage("editor");const r=await window.forge.listDirectory(p.dir);if(r.ok){const f=r.items.find(x=>!x.dir&&(x.name==="index.html"||x.name==="main.js"||x.name==="README.md"));if(f) await openFile(p.dir+"\\"+f.name)}}
async function openFile(file){const r=await window.forge.readFile(file);if(!r.ok)return alert(r.error);currentFile=file;$("#fileName").textContent=file;$("#editorArea").value=r.content}
function modal(open){$("#modal").classList.toggle("hidden",!open)}
async function newProject(){modal(true)}
$("#loginBtn").onclick=()=>{if(!$("#user").value||!$("#pass").value)return alert("Informe usuário e senha.");$("#login").classList.add("hidden");$("#app").classList.remove("hidden");renderProjects()}
$("#logout").onclick=()=>{location.reload()}
document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>showPage(b.dataset.page));
$("#newBtn").onclick=$("#heroNew").onclick=$("#projectsNew").onclick=newProject;
$("#cancelBtn").onclick=()=>modal(false);
$("#chooseRoot").onclick=async()=>{root=await window.forge.selectFolder();$("#rootLabel").textContent=root||"Nenhuma pasta"};
$("#createBtn").onclick=async()=>{const name=$("#pname").value.trim();if(!name||!root)return alert("Informe nome e pasta.");const r=await window.forge.createProject(root,name,$("#ptype").value);if(!r.ok)return alert(r.error);projects.push({name,type:$("#ptype").value,dir:r.dir});saveProjects();modal(false);$("#pname").value="";openProject(projects.at(-1))}
$("#saveBtn").onclick=async()=>{if(!currentFile)return alert("Nenhum arquivo aberto.");const r=await window.forge.writeFile(currentFile,$("#editorArea").value);if(!r.ok)alert(r.error);else $("#fileName").textContent=currentFile+"  ✓ salvo"}
$("#openBtn").onclick=async()=>{const f=await window.forge.selectFile();if(f)openFile(f)}
$("#runCmd").onclick=async()=>{if(!currentProject)return alert("Abra um projeto primeiro.");const cmd=$("#cmd").value.trim();if(!cmd)return;$("#terminalOut").textContent+="\nPS> "+cmd+"\n";const r=await window.forge.runCommand(cmd,currentProject.dir);$("#terminalOut").textContent+=r.stdout+(r.stderr?"\n"+r.stderr:"")+"\n";$("#terminalOut").scrollTop=$("#terminalOut").scrollHeight}
$("#cmd").addEventListener("keydown",e=>{if(e.key==="Enter")$("#runCmd").click()})
$("#buildBtn").onclick=async()=>{if(!currentProject)return alert("Abra um projeto primeiro.");$("#buildLog").textContent="Iniciando build Windows...\\n";const r=await window.forge.runCommand("npm run dist",currentProject.dir);$("#buildLog").textContent+=r.stdout+(r.stderr?"\n"+r.stderr:"");}
$("#aiSend").onclick=()=>{const p=$("#aiPrompt").value.trim();$("#aiOut").textContent=p?`FORGE AI — plano de implementação\\n\\nObjetivo: ${p}\\n\\n1. Analise os requisitos.\\n2. Separe interface, lógica e dados.\\n3. Implemente em módulos.\\n4. Teste os fluxos principais.\\n5. Gere uma build e valide os erros.`:"Digite uma solicitação."}
renderProjects();