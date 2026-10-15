# Arquitetura

## Visão geral

Aplicação web em dois projetos npm: SPA React em `client/` e API REST Express em `server/`. A SPA chama a API; a API consulta o PostgreSQL no Supabase e integra Cloudinary e Resend. O projeto implementa autenticação própria no Express, não Supabase Auth.

## Cliente

- Entrada: `client/src/main.jsx` monta `AppRouter`.
- `client/src/router.jsx` fornece autenticação, navegação, shell e notificações; `client/src/lib/routes.js` associa URLs às telas com carregamento lazy.
- `client/src/context/AuthContext.jsx` mantém usuário, token e operações de sessão.
- `client/src/services/api.js` concentra `fetch`, autenticação Bearer, renovação de token e funções para auth, perfis e anúncios.
- `client/src/routes/` agrupa páginas de `auth/`, `marketplace/`, `profile/` e `admin/`; `client/src/components/` contém UI compartilhada.
- Componentes em `client/src/components/ui/` seguem o padrão Shadcn/ui e usam Radix/Tailwind; há também implementações próprias em `client/src/components/ui.jsx`.
- A vitrine consulta anúncios pela API, mas mantém dados demonstrativos de fallback em `client/src/lib/demo-data.js`.

## API

- `server/src/server.js` carrega o ambiente e inicia o Express; `server/src/app.js` monta CORS, JSON, rotas e middleware de erro.
- Rotas em `server/src/routes/` encaminham para controllers; validação fica em `schemas/` + middleware, regras em `services/` e persistência em `repositories/`.
- `config/` inicializa clientes Supabase, autenticação, Multer e Cloudinary; o acesso ao banco usa `SUPABASE_SERVICE_ROLE_KEY`.
- Prefixos atualmente montados: `/auth`, `/announces`, `/profiles`, `/upload`, `/health`.

## Integrações e limites

- Supabase fornece PostgreSQL; o cliente web não usa o SDK do Supabase.
- Uploads passam pela API e são enviados ao Cloudinary.
- Resend é usado para e-mail de redefinição; sem `RESEND_API_KEY`, o link é exibido no console conforme `server/src/services/mail.service.js`.
- O contexto não pressupõe deploy ativo em Vercel/Render; as menções estão no escopo, sem configuração de deploy identificada.

## Pontos de navegação

- Configuração do cliente: `client/vite.config.js`, `client/package.json`.
- Configuração da API: `server/src/app.js`, `server/src/server.js`, `server/package.json`.
- Autenticação: `client/src/context/AuthContext.jsx`, `client/src/services/api.js`, `server/src/config/auth.js`, `server/src/services/auth.service.js`.
- Modelo e políticas: `supabase/schema.sql`, `supabase/policies.sql`.
