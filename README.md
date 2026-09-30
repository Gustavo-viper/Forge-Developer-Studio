# Forge Developer Studio v3.0 FULL

Forge Developer Studio é um ambiente de desenvolvimento da Forge Studios com:
- Forge IA (chat + agente de desenvolvimento)
- criação de projetos por descrição
- editor de arquivos
- terminal
- painel de projetos
- Supabase
- versão Web
- versão Windows via Electron
- API para operações do agente
- configuração para GitHub + Render

## 1. Instalação

```bash
npm install
npm run dev:web
```

Abra o endereço indicado pelo Vite.

## 2. Configurar Supabase

Copie `.env.example` para `.env`:

```env
VITE_SUPABASE_URL=https://iinprnpqjrfvpmjqtszx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=
FORGE_AI_PROVIDER=
FORGE_AI_API_KEY=
FORGE_SERVER_PORT=8787
```

A chave publishable/anon deve ser adicionada por você. Nunca coloque service_role/secret key no frontend.

## 3. Forge IA

A interface já funciona em modo local/demo. Para ligar um provedor de IA real, configure o backend com:
- FORGE_AI_PROVIDER
- FORGE_AI_API_KEY

O backend foi separado do frontend para que a chave de IA não seja enviada ao navegador.

## 4. Render

Existe um `render.yaml` com Web + API. Configure as variáveis secretas no painel do Render.

## 5. Windows

```bash
npm run desktop
```

Para empacotar:

```bash
npm run dist
```

## Estrutura

- `web/` interface web
- `desktop/` Electron
- `server/` API/agente
- `shared/` modelos e utilitários
- `supabase/` SQL inicial
- `render.yaml` blueprint Render

## Segurança

Segredos devem permanecer em variáveis de ambiente. O frontend usa somente a publishable key do Supabase e RLS deve proteger as tabelas.
