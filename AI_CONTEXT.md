# AI Context

## Visão geral
ReCircula é um marketplace universitário para compra, venda e doação de materiais acadêmicos. O repositório contém uma SPA React, uma API REST Express e SQL para PostgreSQL no Supabase.

## Stack confirmada
- Cliente: JavaScript/JSX, React 19, Vite 8, Tailwind CSS 4; componentes UI locais no padrão Shadcn/ui com Radix UI. Não usa TypeScript.
- Servidor: Node.js, Express 5, Zod; camadas de rotas, controllers, services e repositories.
- Dados e integrações: Supabase/PostgreSQL, autenticação própria com JWT + bcrypt, Cloudinary para imagens e Resend para e-mail de recuperação.
- Ver detalhes e ressalvas em [docs/ai/ARCHITECTURE.md](./docs/ai/ARCHITECTURE.md).

## Arquitetura e estado atual
- `client/` e `server/` são projetos npm independentes; não há manifest de dependências na raiz.
- O cliente chama a API por `client/src/services/api.js`; autenticação e estado de sessão são centralizados em [AuthProvider.jsx](./client/src/context/auth/AuthProvider.jsx).
- A vitrine usa a API quando há anúncios, mas recorre a dados demonstrativos quando a lista está vazia ou a requisição falha.
- A API usa a Service Role Key para acessar o Supabase; não exponha credenciais do servidor ao cliente.

## Entradas e navegação
- Cliente: [client/src/main.jsx](./client/src/main.jsx), [client/src/router.jsx](./client/src/router.jsx) e [client/src/lib/routes.js](./client/src/lib/routes.js).
- API: [server/src/server.js](./server/src/server.js) inicia o serviço; [server/src/app.js](./server/src/app.js) configura middleware e monta `/auth`, `/announces`, `/profiles`, `/upload` e `/health`.
- Banco: [supabase/schema.sql](./supabase/schema.sql), [supabase/policies.sql](./supabase/policies.sql), `seed.sql` e `reset.sql`.

## Contexto modular
Leia somente o guia especializado pertinente à tarefa; confirme sempre o comportamento no código e no schema atuais.
- [Índice dos contextos especializados](./docs/ai/README.md)
- [Arquitetura e módulos](./docs/ai/ARCHITECTURE.md)
- [Modelo de dados e RLS](./docs/ai/DATA_MODEL.md)
- [Fluxos da aplicação](./docs/ai/WORKFLOWS.md)
- [Execução e configuração](./docs/ai/OPERATIONS.md)
- [Lacunas e divergências verificadas](./docs/ai/KNOWN_ISSUES.md)

## Navegação por tarefa
- Autenticação: [AuthProvider.jsx](./client/src/context/auth/AuthProvider.jsx), `client/src/services/api.js`, `server/src/routes/auth.routes.js`, `server/src/services/auth.service.js`; veja também [docs/decisoes/Auth.md](./docs/decisoes/Auth.md).
- Anúncios: `client/src/routes/marketplace/`, `client/src/routes/profile/painel.jsx`, `server/src/routes/announces.routes.js` e camadas correspondentes.
- Perfis e administração: `client/src/routes/profile/`, `client/src/routes/admin/dashboard.jsx`, `server/src/routes/profiles.routes.js`.
- Imagens: `client/src/services/api.js`, `server/src/routes/upload.routes.js`, `server/src/services/storage.service.js`.
- Produto e requisitos: [docs/README.md](./docs/README.md) e [docs/arquitetura/relatorios/Escopo_do_Sistema.md](./docs/arquitetura/relatorios/Escopo_do_Sistema.md).

## Manutenção
- Última verificação do contexto: 2026-10-22.
- Nesta atualização, conferidos: referências de autenticação em `client/src/router.jsx` e [AuthProvider.jsx](./client/src/context/auth/AuthProvider.jsx), e links para os guias especializados. A validação anterior de API, perfis, upload, manifests/scripts, rotas/serviços e schema/policies SQL é de 2026-10-15.
- Não foram executados build, lint, testes ou validação contra serviços remotos. Ver [KNOWN_ISSUES.md](./docs/ai/KNOWN_ISSUES.md) para divergências documentais e comportamentos que exigem atenção.
