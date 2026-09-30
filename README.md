# Forge Developer Studio — v1.0.0 FULL

IDE desktop Windows da Forge Studios.

## Requisitos
- Windows 10/11
- Node.js 20+ recomendado
- npm

## Rodar
```bash
npm install
npm start
```

## Gerar instalador
```bash
npm run dist
```

Os arquivos são gerados em `dist/`.

## Arquitetura
- `src/main.js`: processo principal Electron e operações locais
- `src/preload.js`: ponte segura IPC
- `src/index.html`: interface
- `src/style.css`: UI
- `src/app.js`: lógica da IDE

A versão foi desenhada para receber posteriormente integrações reais de GitHub, Supabase, Gradle/Android, IA, plugins e atualizações.
