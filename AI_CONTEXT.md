# AI Context

## 1. Visão geral
- ReCircula é um marketplace universitário de economia circular para compra, venda e doação de materiais acadêmicos.
- O repositório contém uma SPA React, uma API REST Express e scripts SQL para Supabase.
- Atenção ao estado atual: a interface usa dados e sessão demonstrativos; não foi encontrada integração ativa do cliente com a API. Não presuma que as telas persistem dados no backend.

## 2. Stack e ferramentas
- Cliente: JavaScript/JSX, React 19, Vite 8, Tailwind CSS 4 e componentes próprios baseados em Radix UI.
- Servidor: JavaScript ES modules, Node.js e Express 5; Zod valida entradas.
- Persistência: PostgreSQL no Supabase, acessado pelo servidor via `@supabase/supabase-js`.
- Serviços: Cloudinary para imagens; Resend para e-mails de recuperação (opcional em desenvolvimento).
- Ferramentas declaradas: ESLint e Prettier no cliente. Os manifests não declaram scripts de teste.

## 3. Arquitetura e estado da integração
- Cliente e API são projetos separados, cada um com seu próprio `package.json`; não há manifest de dependências na raiz.
- Cliente: `client/src/main.jsx` monta o `AppRouter`; `client/src/lib/routes.js` mapeia URLs para telas carregadas sob demanda.
- API: `server/src/server.js` inicia o Express, configurado em `server/src/app.js`; rotas encaminham para controllers, services e repositories.
- API → dados: repositories usam o cliente Supabase configurado com a Service Role Key. O cliente web não deve receber essa chave.
- A autenticação implementada é própria: bcrypt para senhas, JWT de acesso e tokens opacos de renovação/recuperação. Supabase é banco, não provedor de autenticação.
- O cliente atualmente usa `demo-data.js` e `demo-session.js` (estado em `localStorage`); busque e confirme integração antes de conectar uma tela à API.

## 4. Estrutura do repositório
- `client/src/routes/`: telas agrupadas em `auth/`, `marketplace/`, `profile/` e `admin/`.
- `client/src/components/`, `client/src/context/`, `client/src/hooks/`, `client/src/lib/`: componentes compartilhados, navegação e dados/utilitários demonstrativos.
- `server/src/`: `config/`, `controllers/`, `middlewares/`, `repositories/`, `routes/`, `schemas/`, `services/` e `utils/`.
- `supabase/`: `schema.sql`, `policies.sql`, `seed.sql` e `reset.sql`.
- `docs/`: escopo, requisitos, contrato inicial de API, decisão de autenticação, DER, protótipos e documentos de equipe; comece por [docs/README.md](./docs/README.md).
- Manifests e orientações: [client/package.json](./client/package.json), [server/package.json](./server/package.json), [server/README_API.md](./server/README_API.md), [supabase/README_SUPABASE.md](./supabase/README_SUPABASE.md).

## 5. Fluxos e pontos de entrada
### Cliente
- Entrada em [client/src/main.jsx](./client/src/main.jsx); o mapeamento de URL e telas está em [client/src/lib/routes.js](./client/src/lib/routes.js), com tratamento de navegação no [client/src/router.jsx](./client/src/router.jsx).
- A vitrine lê anúncios demonstrativos de `client/src/lib/demo-data.js`; a sessão demonstrativa é mantida em `client/src/lib/demo-session.js`.

### API
- Montagem e prefixos das rotas em [server/src/app.js](./server/src/app.js); inicialização/porta em [server/src/server.js](./server/src/server.js).
- Anúncios: `server/src/routes/announces.routes.js` → controller/service/repository correspondentes; escritas exigem autenticação e atribuem o usuário autenticado.
- Perfis: `server/src/routes/profiles.routes.js`; `GET /profiles` e `PATCH /profiles` são do usuário autenticado, enquanto `GET /profiles/:id` é público na implementação atual.
- Autenticação: `server/src/routes/auth.routes.js` → `auth.controller.js` → `auth.service.js`; verificação JWT em `authenticate.middleware.js`. Upload `POST /upload` exige autenticação e usa Multer/Cloudinary.
- Dados e variáveis de autenticação: [server/src/config/supabase.js](./server/src/config/supabase.js), [server/src/config/auth.js](./server/src/config/auth.js) e [docs/decisoes/Auth.md](./docs/decisoes/Auth.md).

### Banco
- `profiles` guarda e-mail, hash bcrypt e papel; `announces` referencia o perfil; `refresh_tokens` e `password_resets` guardam hashes de tokens.
- Confira [supabase/schema.sql](./supabase/schema.sql) e [supabase/policies.sql](./supabase/policies.sql) antes de alterar dados ou acesso.

## 6. Execução e configuração
- Instale dependências separadamente dentro de `client/` e `server/` usando `npm install`.
- Cliente: `npm run dev`, `npm run build`, `npm run lint` (scripts em `client/package.json`; Vite usa a porta padrão 5173).
- Servidor: `npm run dev` ou `npm start` (scripts em `server/package.json`; porta padrão 3001).
- Não há scripts de teste declarados nos manifests. Não foi verificada execução de build ou testes nesta análise.
- Variáveis do servidor identificadas em `server/.env.example` e no código: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PORT`, `VERCEL_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `JWT_SECRET`, `JWT_ACCESS_EXPIRES`, `REFRESH_TOKEN_DAYS`, `ADMIN_SIGNUP_CODE`, `FRONTEND_URL`, `RESEND_API_KEY`, `MAIL_FROM`.
- `JWT_SECRET` é obrigatório na inicialização da configuração de autenticação; há defaults no código para duração de tokens, URL local do frontend e remetente de e-mail. Nunca exponha segredos no cliente.
- O CORS da API admite `http://localhost:5173` e `VERCEL_URL`. Confirme o formato da URL de deploy antes de alterá-lo.

## 7. Regras, decisões e navegação para mudanças
- Validar entradas e permissões no backend; não confiar em `user_id` fornecido pelo cliente para escritas.
- A decisão documentada é autenticação própria no Express, com rotação de refresh tokens e invalidação de sessões em caso de reuso; consulte [docs/decisoes/Auth.md](./docs/decisoes/Auth.md) antes de mudar esse fluxo.
- Para endpoints e regras de API, consulte a implementação em `server/src/routes/`, `controllers/`, `services/` e `repositories/`; o contrato em `docs/arquitetura/api/rotas_backend.md` é inicial e pode divergir.
- Para telas, consulte `client/src/lib/routes.js` e o módulo em `client/src/routes/` correspondente.
- Para schema, políticas ou seed, consulte os SQLs e [supabase/README_SUPABASE.md](./supabase/README_SUPABASE.md).
- Leia apenas os documentos especializados relevantes para a tarefa; não assuma que a documentação substitui a verificação do código.

## 8. Lacunas e inconsistências conhecidas
- O link de redefinição gerado pelo servidor usa `/redefinir-senha`, mas a rota atual do cliente é `/nova-senha`; o contrato deve ser alinhado antes de validar recuperação de senha ponta a ponta.
- O contrato documenta rotas de perfil como `/profiles/me`; a implementação atual usa `GET /profiles` e `PATCH /profiles`, com busca pública por ID em `GET /profiles/:id`.
- O contrato e alguns documentos descrevem fluxos que podem não estar conectados à interface demonstrativa. Confirme comportamento diretamente no código antes de depender deles.
- A integração SPA/API, disponibilidade do banco e configuração real dos serviços externos não foram executadas/verificadas nesta atualização.

## 9. Manutenção deste documento
- Última análise: 2026-10-12.
- Áreas verificadas: manifests/scripts, estrutura principal, rotas do cliente e da API, autenticação, variáveis de ambiente pelo exemplo e código, schema SQL e documentação de arquitetura/autenticação.
- Não foi feita leitura exaustiva de todas as telas, endpoints, policies, requisitos ou fluxos de deploy; não foram executados build, lint ou testes.
