require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const port = Number(process.env.FORGE_SERVER_PORT || 8787);

const projects = new Map();

function makePlan(message) {
  const text = String(message || "").toLowerCase();
  const wantsWeb = /site|web|html|frontend|dashboard|sistema|app/.test(text);
  const wantsDb = /banco|database|supabase|cliente|cadastro|login|estoque/.test(text);
  const files = [
    "README.md",
    "src/index.html",
    "src/style.css",
    "src/app.js"
  ];
  if (wantsDb) files.push("src/lib/supabase.js", "supabase/schema.sql");
  if (wantsWeb) files.push("src/components/");
  return {
    summary: "Plano gerado pela Forge IA",
    steps: [
      "Entender requisitos",
      "Criar estrutura",
      "Gerar arquivos",
      wantsDb ? "Preparar integração Supabase" : "Preparar dados locais",
      "Executar testes",
      "Apresentar resultado"
    ],
    files
  };
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "Forge Developer Studio API",
    version: "3.0.0",
    aiConfigured: Boolean(process.env.FORGE_AI_PROVIDER && process.env.FORGE_AI_API_KEY),
    supabaseConfigured: Boolean(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_PUBLISHABLE_KEY)
  });
});

app.post("/api/ai/chat", (req, res) => {
  const message = String(req.body?.message || "").trim();
  if (!message) return res.status(400).json({ error: "Mensagem vazia." });

  const plan = makePlan(message);
  const configured = Boolean(process.env.FORGE_AI_PROVIDER && process.env.FORGE_AI_API_KEY);

  res.json({
    mode: configured ? "provider-ready" : "local-agent",
    message: configured
      ? "A Forge IA recebeu seu pedido e está pronta para executar o fluxo configurado."
      : "A Forge IA recebeu seu pedido. O agente local já consegue transformar o pedido em um plano de projeto. Configure o provedor de IA para respostas generativas avançadas.",
    plan
  });
});

app.post("/api/projects/plan", (req, res) => {
  res.json(makePlan(req.body?.prompt || ""));
});

app.post("/api/projects/register", (req, res) => {
  const id = `forge-${Date.now()}`;
  const project = {
    id,
    name: req.body?.name || "Novo Projeto",
    path: req.body?.path || "",
    createdAt: new Date().toISOString()
  };
  projects.set(id, project);
  res.json(project);
});

app.get("/api/projects", (_req, res) => {
  res.json([...projects.values()]);
});

app.listen(port, () => {
  console.log(`Forge Developer Studio API running on http://localhost:${port}`);
});
