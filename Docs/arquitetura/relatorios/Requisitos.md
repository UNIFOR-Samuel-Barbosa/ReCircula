# 📋 Requisitos do Sistema

---

## 🧩 Atores do Sistema

| Ator                        | Descrição                                                                               |
| --------------------------- | --------------------------------------------------------------------------------------- |
| **Usuário não autenticado** | Visitante que acessa a landing page e pode navegar publicamente                         |
| **Usuário autenticado**     | Estudante logado com acesso completo ao marketplace                                     |
| **Backend (API REST)**      | Serviço intermediário que processa regras de negócio, autenticação nativa (JWT) e dados |
| **Cloudinary**              | Serviço externo de armazenamento e entrega de imagens                                   |

---

## ✅ Requisitos Funcionais

### RF01 — Cadastro de usuário

- O sistema deve permitir que um novo usuário crie uma conta fornecendo **e-mail** e **senha**.
- Pode ser utilizado qualquer endereço de e-mail válido; não é exigido e-mail universitário.
- Ao criar a conta, um **perfil** é automaticamente vinculado ao usuário com nome, biografia, telefone e foto opcionais.

### RF02 — Login de usuário

- O sistema deve permitir que um usuário registrado autentique-se com **e-mail** e **senha**.
- Após autenticação bem-sucedida, o sistema deve **redirecionar** o usuário para a página principal do marketplace.

### RF03 — Logout

- O sistema deve permitir que o usuário encerre sua sessão ativa a qualquer momento.

### RF04 — Recuperação de senha

- O sistema deve permitir que o usuário solicite a **recuperação de senha** informando seu e-mail.
- O sistema deve gerar e enviar um link/código de redefinição para o e-mail cadastrado.

### RF05 — Redefinição de senha

- O sistema deve permitir que o usuário **redefina sua senha** ao acessar o link enviado por e-mail.
- O sistema deve exibir um formulário de redefinição de senha quando detectar que o usuário está em modo de recuperação.

### RF06 — Persistência e renovação de sessão

- O sistema deve manter o usuário autenticado entre sessões (persistência de sessão).
- O token de acesso deve ser **atualizado automaticamente** antes do vencimento.

### RF07 — Publicação de anúncio

- O usuário autenticado deve poder criar um novo anúncio fornecendo:
  - **Título** (obrigatório)
  - **Categoria** (obrigatório): Livros, Eletrônicos, Acessórios, Jalecos, Engenharia, Computação ou Móveis
  - **Descrição** (opcional)
  - **Imagem** (obrigatória, enviada via upload)
  - **Preço** (opcional numérico ≥ 0)
  - **Doação** (flag booleana — se marcada, o campo preço é desabilitado)

### RF08 — Upload de imagem para anúncio

- O sistema deve permitir o upload de uma **imagem** associada ao anúncio ou ao perfil do usuário.
- A imagem deve ser enviada ao backend no formato `multipart/form-data` e armazenada no **Cloudinary**.
- O sistema deve retornar a URL segura (`secure_url`) da imagem após o upload.

### RF09 — Listagem pública de anúncios

- O sistema deve exibir todos os anúncios publicados para **qualquer visitante** (autenticado ou não).
- Os anúncios devem exibir: imagem, título, categoria, preço (ou indicativo de doação), nome e foto do anunciante quando disponíveis.
- E-mail e telefone do anunciante não devem ser exibidos na interface.

### RF10 — Busca de anúncios por texto

- O sistema deve permitir buscar anúncios por **texto livre** no título.
- A busca deve utilizar **debounce de 500ms** para evitar requisições excessivas.

### RF11 — Filtro por categoria

- O sistema deve permitir filtrar anúncios por uma **categoria específica**.
- A lista de categorias disponíveis deve ser carregada dinamicamente a partir dos anúncios existentes.

### RF12 — Filtro por doação

- O sistema deve permitir filtrar para exibir apenas anúncios marcados como **doação**.

### RF13 — Ordenação de anúncios

- O sistema deve permitir ordenar os anúncios por:
  - **Mais recente** (`recent`)
  - **Menor preço** (`price-asc`)
  - **Maior preço** (`price-desc`)

### RF14 — Exclusão de anúncio

- O usuário autenticado deve poder **excluir seus próprios anúncios**.
- O sistema deve exibir uma **confirmação** antes de executar a exclusão.
- A exclusão requer conexão ativa com a internet para confirmação e sincronização com o backend.

### RF15 — Visualização do perfil próprio

- O usuário autenticado deve poder visualizar seu próprio perfil com: foto, nome, biografia e lista de anúncios publicados.
- O telefone é um dado privado, não deve ser apresentado como texto na interface e pode ser mantido para gerar o link de contato via WhatsApp.

### RF16 — Visualização de perfil de outro usuário

- Somente um usuário autenticado pode visualizar o perfil de **outro usuário** pelo seu ID, com foto, nome, biografia e galeria de anúncios.
- E-mail e telefone não devem ser exibidos como texto na interface.

### RF17 — Edição de perfil

- O usuário autenticado deve poder editar as seguintes informações do próprio perfil:
  - **Nome** (mínimo 2 caracteres)
  - **Biografia** (máximo 150 caracteres)
  - **Telefone** (máximo 20 caracteres, com formatação automática)
  - **Foto de perfil** (upload de imagem via Cloudinary)

### RF18 — Contato via WhatsApp

- Ao visualizar o perfil de outro usuário, deve existir um botão que **abra uma nova conversa no WhatsApp** com mensagem pré-preenchida, caso o anunciante tenha informado seu telefone.
- O número de telefone não deve ser exibido visualmente; o contato ocorre pelo botão.

### RF19 — Dashboard de anúncios do usuário

- O usuário autenticado deve poder acessar um painel listando **apenas seus próprios anúncios**, com suporte a todos os filtros (texto, categoria, doação e ordenação).

---

## 🚫 Requisitos Não Funcionais

### RNF01 — Autenticação e segurança de tokens

- A autenticação deve utilizar **JWT** (JSON Web Token) gerado e validado diretamente pelo próprio backend (Node.js/Express) com senhas criptografadas via **bcrypt**.
- O token de acesso deve ser enviado no cabeçalho HTTP `Authorization: Bearer <token>` em todas as rotas protegidas.
- As credenciais de conexão ao banco de dados (Supabase/PostgreSQL) e a chave secreta do JWT devem permanecer **exclusivamente no backend** via variáveis de ambiente (`.env`) e jamais ser expostas ao frontend.

### RNF02 — Autorização e controle de acesso

- O backend deve implementar middlewares de controle de acesso e autorização baseados no identificador do usuário validado no token JWT.
- Usuários só podem **atualizar e excluir** seus próprios anúncios e perfil.
- Anúncios são legíveis por qualquer visitante, sem exigência de login.
- A consulta de perfis exige autenticação; visitantes não autenticados não podem consultar perfis próprios ou de outros usuários.
- E-mail e telefone não devem ser apresentados na interface como dados públicos do perfil.
- O backend deve validar a propriedade do recurso antes de permitir operações de escrita ou exclusão.

### RNF03 — Validação de dados

- Todas as entradas do usuário devem ser validadas no **backend** usando a biblioteca **Zod**.
- Campos inválidos devem retornar erro HTTP `400` com mensagem descritiva.
- A validação deve incluir: tipos de dados, comprimento mínimo/máximo e campos obrigatórios.

### RNF04 — Tratamento centralizado de erros

- O backend deve utilizar um **middleware global de erros** para padronizar as respostas de erro.
- As respostas de erro devem seguir códigos HTTP semânticos: 400, 401, 403, 404, 500, 503.
- Falhas de conexão com a base de dados ou indisponibilidade de serviços externos devem retornar HTTP `503`.

### RNF05 — Performance — Cache Stale While Revalidate

- O frontend deve implementar a estratégia de cache **Stale While Revalidate (SWR)**:
  - Exibir dados em cache imediatamente (resposta instantânea ao usuário).
  - Atualizar os dados em segundo plano de forma transparente.
- O cache deve ser **identificado por chave** composta pelos parâmetros da requisição.
- Um toast de "carregando" deve ser exibido somente se a atualização em segundo plano demorar mais de **1 segundo**.

### RNF06 — Performance — Debounce de busca

- A busca por texto deve aplicar **debounce de 500ms** antes de disparar a requisição ao backend.

### RNF07 — Responsividade

- A interface deve ser **totalmente responsiva**, adaptando-se a dispositivos móveis e desktops.
- Layouts e espaçamentos devem se ajustar automaticamente via **TailwindCSS**.

### RNF09 — Usabilidade — Feedback visual

- O sistema deve exibir **indicadores de carregamento** (Spinner) durante operações assíncronas.
- O sistema deve emitir **Toasts independentes** para sucesso, erro e progresso, sem que o fechamento de um interfira nos demais.
- Cada Toast deve possuir um **ID único** e **timer independente**.

### RNF10 — Arquitetura em camadas (Backend)

- O backend deve seguir a arquitetura: **Routes → Middlewares → Controllers → Services → Repository → Supabase**.
- Cada camada deve ter responsabilidade única e bem definida.
- A separação deve facilitar testes unitários, manutenção e evolução independente de cada camada.

### RNF11 — Padronização em JavaScript (ES6+)

- Todo o código (frontend e backend) deve ser escrito em **JavaScript moderno (ES6+)**, utilizando módulos ES (`import`/`export`), funções assíncronas (`async`/`await`) e padrões consistentes de codificação.
- Constantes, modelos de dados e utilitários devem ser organizados em módulos dedicados para facilitar a manutenção.

### RNF12 — Escalabilidade da API

- A API REST deve suportar **múltiplos filtros combinados** em uma única requisição (categoria + busca + doação + ordenação + user_id).
- A lógica de filtragem deve ser reutilizada entre a listagem pública e o dashboard do usuário.

### RNF13 — Upload de imagens

- O upload de imagens deve ser processado via **Multer** no backend (parse de `multipart/form-data`).
- As imagens devem ser armazenadas no **Cloudinary** e referenciadas apenas pela URL pública gerada.
- O sistema requer conexão ativa com a internet para upload e persistência de imagens.

### RNF14 — Implantação e infraestrutura

- O **frontend** deve ser implantado no **Vercel** com domínio público acessível.
- O **backend** deve ser implantado no **Render** e consumido exclusivamente pelo frontend.
- O banco de dados deve ser hospedado no **Supabase** (PostgreSQL gerenciado).
- As variáveis de ambiente sensíveis não devem ser versionadas no repositório.

### RNF16 — Manutenção do banco de dados

- Os scripts SQL do banco de dados (schema, políticas e seeds) devem ser **versionados** no repositório.
- A estrutura do banco deve ser reproduzível em qualquer ambiente Supabase a partir dos scripts SQL disponibilizados.

---

## 📐 Regras de Negócio

| ID   | Regra                                                                                                            |
| ---- | ---------------------------------------------------------------------------------------------------------------- |
| RN01 | Um anúncio marcado como **doação** não pode ter preço preenchido.                                                |
| RN02 | O preço de um anúncio, quando informado, deve ser **maior ou igual a zero**.                                     |
| RN03 | Somente o **dono do anúncio** pode editá-lo ou excluí-lo.                                                        |
| RN04 | Somente o **dono do perfil** pode editá-lo.                                                                      |
| RN05 | O botão de contato via WhatsApp só é exibido ao visualizar o **perfil de outro usuário** (não o próprio).        |
| RN06 | Operações de escrita (criar, editar, excluir) **requerem conexão com a internet**.                               |
| RN07 | O campo telefone é formatado automaticamente conforme o usuário digita.                                          |
| RN08 | A biografia do perfil está limitada a **150 caracteres** tanto no backend quanto no campo de edição do frontend. |
