# AI Context

## 1. Visão geral
- Projeto: ReCircula
- Finalidade: marketplace universitário de economia circular para compra, venda e doação de itens acadêmicos e materiais usados entre estudantes.
- Estado conhecido: estrutura de front-end + API + banco no Supabase já organizada em diretórios e documentos de arquitetura dentro de [docs/README.md](./docs/README.md).
- Usuários/consumidores: estudantes universitários e comunidade acadêmica que precisam anunciar itens ou consultar anúncios públicos.

## 2. Stack e ferramentas
- Front-end: React + Vite + JavaScript, com Tailwind e componentes do ecossistema Shadcn/Radix.
- Back-end: Node.js + Express (JavaScript), com rotas, controllers, repositories e middlewares.
- Banco/Autenticação: Supabase PostgreSQL + Supabase Auth; JWTs são validados pelo backend com `supabase.auth.getUser(token)`.
- Validação: Zod.
- Upload de imagens: Multer + Cloudinary.
- Dependências confirmadas:
  - client: React 19, Vite 8, Tailwind 4, ESLint, Prettier.
  - server: Express 5, Supabase JS, CORS, dotenv, multer, zod.

## 3. Arquitetura
- Padrão: full-stack desacoplado, com SPA no cliente e API REST no servidor.
- Cliente: roteamento local em `client/src/router.jsx`; páginas carregadas com `lazy` por rota.
- API: ponto de entrada em `server/src/server.js`; aplicação montada em `server/src/app.js`, com rotas em `server/src/routes` e lógica em controllers/repositories.
- Dados: perfis e anúncios em Supabase; a API acessa o banco via `server/src/config/supabase.js` usando a Service Role Key do servidor.
- Fluxo principal: frontend chama a API REST; backend valida JWT para rotas autenticadas e persiste/consulta dados no Supabase.

## 4. Estrutura do repositório
- [client/](./client): aplicação front-end.
  - [client/src/router.jsx](./client/src/router.jsx): definição das rotas principais.
  - [client/src/routes](./client/src/routes): páginas por módulo (auth, profile, marketplace, admin).
  - [client/src/components](./client/src/components): UI compartilhada.
  - [client/package.json](./client/package.json): scripts e dependências do cliente.
- [server/](./server): API REST.
  - [server/src/server.js](./server/src/server.js): inicia o servidor na porta 3001 por padrão.
  - [server/src/app.js](./server/src/app.js): configuração do Express, CORS e rotas.
  - [server/src/routes](./server/src/routes): endpoints públicos/autenticados.
  - [server/src/controllers](./server/src/controllers): lógica de controllers.
  - [server/src/repositories](./server/src/repositories): acesso ao Supabase.
  - [server/src/middlewares](./server/src/middlewares): autenticação e validação.
  - [server/src/config/supabase.js](./server/src/config/supabase.js): cliente Supabase do backend.
  - [server/package.json](./server/package.json): scripts e dependências do servidor.
- [supabase/](./supabase): schema, policies, seed e reset do banco.
  - [supabase/README_SUPABASE.md](./supabase/README_SUPABASE.md): orientação do banco e variáveis de ambiente.
- [docs/](./docs): documentação de planejamento, arquitetura e protótipos.
  - [docs/README.md](./docs/README.md): índice do material documental.
  - [docs/arquitetura/api/rotas_backend.md](./docs/arquitetura/api/rotas_backend.md): contrato de rotas.
  - [docs/arquitetura/relatorios/Escopo_do_Sistema.md](./docs/arquitetura/relatorios/Escopo_do_Sistema.md): visão geral do problema e tecnologias.

## 5. Fluxos principais
### Front-end: navegação principal
- O cliente define rotas como `/`, `/entrar`, `/cadastro`, `/dashboard`, `/painel`, `/perfil`, `/usuario/:id`, `/publicar`, `/anuncio/:id` em [client/src/router.jsx](./client/src/router.jsx).
- A resolução de rota usa `matchRoute` e `AppRouter`, com `lazy` para carregamento das páginas.

### API: anúncios
- Rotas principais em [server/src/routes/announces.routes.js](./server/src/routes/announces.routes.js): listar, buscar por categoria/usuário, listar meus anúncios, criar, atualizar e excluir.
- A autenticação ocorre por `Authorization: Bearer <token>` e é validada pelo middleware em [server/src/middlewares/authenticate.middleware.js](./server/src/middlewares/authenticate.middleware.js).
- A persistência fica em [server/src/repositories/announce.repository.js](./server/src/repositories/announce.repository.js) usando `supabase.from("announces")`.

### API: perfis
- Rotas em [server/src/routes/profiles.routes.js](./server/src/routes/profiles.routes.js) para consultar o perfil atual ou por ID e atualizar dados do próprio perfil.
- A camada de persistência está em [server/src/repositories/profile.repository.js](./server/src/repositories/profile.repository.js).

### Upload e mídia
- O backend expõe rotas de upload em `server/src/routes/upload.routes.js` e processa imagem com Multer + Cloudinary; a documentação do contrato está em [docs/arquitetura/api/rotas_backend.md](./docs/arquitetura/api/rotas_backend.md).

## 6. Dados e integrações
- Entidades principais documentadas no banco: `profiles` e `announces`.
- A API não armazena senhas de usuários; o Supabase Auth cuida da sessão e da emissão dos JWTs.
- Variáveis de ambiente confirmadas:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `PORT` (backend)
- Credenciais sensíveis: a Service Role Key fica no backend e não deve ser exposta ao front-end.

## 7. Execução e desenvolvimento
- Cliente (confirmado por [client/package.json](./client/package.json)):
  - `npm install`
  - `npm run dev`
  - `npm run build`
  - `npm run lint`
- Servidor (confirmado por [server/package.json](./server/package.json)):
  - `npm install`
  - `npm run dev`
  - `npm run start`
- Porta padrão do backend: 3001 (`server/src/server.js`).
- Front-end local: Vite geralmente usa a porta 5173; o CORS do backend permite `http://localhost:5173` em [server/src/app.js](./server/src/app.js).

## 8. Convenções e regras de negócio
- O backend valida entrada com Zod e usa o usuário autenticado para operações de escrita; não é confiável um `user_id` enviado pelo cliente.
- O marketplace prioriza a compra, venda e doação de itens relacionados à vida universitária.
- Dados pessoais sensíveis (telefone/e-mail) devem permanecer restritos; a documentação do contrato reforça que terceiros não recebem esses dados em resposta.
- Fluxos de autenticação e recuperação ficam no Supabase Auth, não na API Express.

## 9. Decisões e restrições
- Arquitetura desacoplada: cliente e API operam separadamente.
- O backend usa o Supabase como backend de dados e autenticação, mantendo o front-end sem acesso direto privilegiado ao banco.
- O projeto foi planejado com foco em comunidade acadêmica, peer-to-peer e contato direto via WhatsApp em vez de intermediação financeira.
- Hiperespecificações de UI e regras de negócio mais detalhadas devem ser confirmadas diretamente nos documentos da pasta [docs/](./docs) e nos arquivos do cliente/servidor.

## 10. Guia de navegação para IAs
- Antes de alterar regras de negócio ou fluxo de usuários: ler [docs/arquitetura/relatorios/Escopo_do_Sistema.md](./docs/arquitetura/relatorios/Escopo_do_Sistema.md) e [docs/arquitetura/api/rotas_backend.md](./docs/arquitetura/api/rotas_backend.md).
- Para mexer em publicações: revisar [server/src/routes/announces.routes.js](./server/src/routes/announces.routes.js), [server/src/controllers/announce.controller.js](./server/src/controllers/announce.controller.js) e [server/src/repositories/announce.repository.js](./server/src/repositories/announce.repository.js).
- Para mexer em perfis: revisar [server/src/routes/profiles.routes.js](./server/src/routes/profiles.routes.js), [server/src/controllers/profile.controller.js](./server/src/controllers/profile.controller.js) e [server/src/repositories/profile.repository.js](./server/src/repositories/profile.repository.js).
- Para mexer em UI: revisar [client/src/router.jsx](./client/src/router.jsx) e os módulos em [client/src/routes](./client/src/routes).
- Para mexer em estrutura do banco: revisar [supabase/](./supabase) e o README do banco.

## 11. Lacunas e pontos de atenção
- O diretório atual documenta arquitetura e wireframes gerais, mas não substitui a leitura dos módulos relevantes antes de qualquer alteração.
- As interfaces e fluxos específicos do cliente devem ser confirmados nas rotas e páginas correspondentes, porque a documentação de alto nível não detalha toda a implementação.
- Os documentos existentes são mais fortes em visão de produto, arquitetura e contrato de API do que em mapa completo da UI por componente.

## 12. Manutenção deste documento
- Última análise: 2026-10-11.
- Áreas verificadas: estrutura geral do repositório, stack, rotas principais, backend/auth, banco Supabase e documentação de arquitetura.
- Limitações: o arquivo não substitui a leitura dos módulos em questão; ainda não foi feita revisão exaustiva de cada página do cliente ou de cada endpoint do backend.
- Fontes principais: [docs/README.md](./docs/README.md), [docs/arquitetura/relatorios/Escopo_do_Sistema.md](./docs/arquitetura/relatorios/Escopo_do_Sistema.md), [docs/arquitetura/api/rotas_backend.md](./docs/arquitetura/api/rotas_backend.md), [server/package.json](./server/package.json), [client/package.json](./client/package.json), [server/src/app.js](./server/src/app.js), [server/src/config/supabase.js](./server/src/config/supabase.js), [server/src/routes/announces.routes.js](./server/src/routes/announces.routes.js), [server/src/routes/profiles.routes.js](./server/src/routes/profiles.routes.js), [client/src/router.jsx](./client/src/router.jsx).
