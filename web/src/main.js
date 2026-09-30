import { createClient } from "@supabase/supabase-js";
import "./style.css";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://iinprnpqjrfvpmjqtszx.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
const API = import.meta.env.VITE_FORGE_API_URL || "http://localhost:8787";

const supabase = SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const state = {
  messages: [
    {
      role: "forge",
      text: "Olá! Eu sou a Forge IA. 🚀 Me diga o que você quer criar e eu preparo o projeto para você."
    }
  ]
};

document.querySelector("#app").innerHTML = `
<div class="shell">
  <aside class="sidebar">
    <div class="brand"><div class="logo">F</div><div><b>FORGE</b><span>DEVELOPER STUDIO</span></div></div>
    <button class="nav active" data-view="ai">🤖 Forge IA</button>
    <button class="nav" data-view="projects">📁 Projetos</button>
    <button class="nav" data-view="editor">⌨️ Editor</button>
    <button class="nav" data-view="terminal">▣ Terminal</button>
    <button class="nav" data-view="database">🗄️ Banco de Dados</button>
    <button class="nav" data-view="github">◉ GitHub</button>
    <button class="nav" data-view="render">☁️ Render</button>
    <div class="side-bottom"><span class="dot"></span> Forge IA pronta</div>
  </aside>

  <main class="main">
    <header><div><strong id="title">Forge IA</strong><small>Developer Agent • v3.0</small></div><div class="status">● ONLINE</div></header>

    <section id="view-ai" class="view active">
      <div class="hero"><div class="spark">✦</div><h1>O que vamos criar?</h1><p>Descreva o aplicativo, site, jogo ou sistema. A Forge IA transforma sua ideia em um plano de desenvolvimento.</p></div>
      <div id="chat" class="chat"></div>
      <form id="chat-form" class="composer">
        <textarea id="prompt" placeholder="Ex.: crie um sistema de assistência técnica com login, clientes, ordens, orçamento e Supabase..." rows="2"></textarea>
        <button>➤ Criar</button>
      </form>
    </section>

    <section id="view-projects" class="view"><div class="panel"><h2>Projetos</h2><p>Projetos criados pela Forge IA aparecerão aqui.</p><div id="project-list" class="cards"></div></div></section>
    <section id="view-editor" class="view"><div class="panel"><h2>Editor</h2><div class="editor"><div class="files"><div>📄 index.html</div><div>🎨 style.css</div><div>⚙️ app.js</div></div><pre>// Selecione um arquivo para editar.</pre></div></div></section>
    <section id="view-terminal" class="view"><div class="panel"><h2>Terminal</h2><div class="terminal"><span>forge@developer-studio:~$</span> aguardando comando...</div></div></section>
    <section id="view-database" class="view"><div class="panel"><h2>Supabase</h2><p>Projeto configurado:</p><code>${SUPABASE_URL}</code><div class="notice">🔐 A chave fica fora do código. Preencha <b>VITE_SUPABASE_PUBLISHABLE_KEY</b> no ambiente.</div><button id="test-db" class="secondary">Testar conexão</button><div id="db-result"></div></div></section>
    <section id="view-github" class="view"><div class="panel"><h2>GitHub</h2><p>Área preparada para sincronizar o projeto e enviar commits.</p><div class="notice">Tokens do GitHub devem ficar somente no servidor/ambiente seguro.</div></div></section>
    <section id="view-render" class="view"><div class="panel"><h2>Render</h2><p>O projeto inclui <code>render.yaml</code> para configurar Web + API.</p><div class="notice">Depois de conectar o repositório no Render, configure as variáveis de ambiente indicadas no README.</div></div></section>
  </main>
</div>`;

function renderChat() {
  document.querySelector("#chat").innerHTML = state.messages.map(m => `<div class="msg ${m.role}"><div class="bubble">${escapeHtml(m.text)}</div></div>`).join("");
  const c = document.querySelector("#chat"); c.scrollTop = c.scrollHeight;
}
function escapeHtml(v) { return v.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }

document.querySelectorAll(".nav").forEach(btn => btn.onclick = () => {
  document.querySelectorAll(".nav").forEach(x => x.classList.remove("active"));
  document.querySelectorAll(".view").forEach(x => x.classList.remove("active"));
  btn.classList.add("active");
  document.querySelector(`#view-${btn.dataset.view}`).classList.add("active");
  document.querySelector("#title").textContent = btn.textContent.trim();
});

document.querySelector("#chat-form").onsubmit = async e => {
  e.preventDefault();
  const input = document.querySelector("#prompt");
  const message = input.value.trim();
  if (!message) return;
  state.messages.push({ role: "user", text: message });
  input.value = "";
  renderChat();
  state.messages.push({ role: "forge", text: "Analisando seu pedido e montando o plano do projeto... ⚙️" });
  renderChat();

  try {
    const r = await fetch(`${API}/api/ai/chat`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({message})
    });
    const data = await r.json();
    state.messages.pop();
    state.messages.push({ role: "forge", text: `${data.message}\n\n${data.plan.steps.map((s,i)=>`${i+1}. ${s}`).join("\n")}\n\nArquivos previstos: ${data.plan.files.join(", ")}` });
  } catch {
    state.messages.pop();
    state.messages.push({ role: "forge", text: "Não consegui acessar a API da Forge IA agora. Verifique se o servidor está rodando em http://localhost:8787." });
  }
  renderChat();
};

document.querySelector("#test-db").onclick = async () => {
  const out = document.querySelector("#db-result");
  if (!supabase) { out.textContent = "Chave Supabase ainda não configurada."; return; }
  const { error } = await supabase.auth.getSession();
  out.textContent = error ? `Erro: ${error.message}` : "Supabase conectado e cliente inicializado.";
};

renderChat();
