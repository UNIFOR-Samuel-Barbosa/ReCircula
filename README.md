# ReCircula

> Marketplace universitário para dar uma nova vida a materiais acadêmicos — por meio de vendas e doações entre estudantes.

<p align="center">
  <img src="client/src/assets/recircula-logo.png" alt="Logo do ReCircula" width="180">
</p>

O ReCircula conecta pessoas que procuram materiais acadêmicos a estudantes que desejam vender ou doar itens que já não usam. A proposta é facilitar o reaproveitamento, incentivar a economia circular e tornar esses materiais mais acessíveis à comunidade universitária.

## Sobre o projeto

Este projeto foi desenvolvido como trabalho da cadeira **Desenvolvimento de Plataformas Web**, no **4º semestre de Ciências da Computação** da **Universidade de Fortaleza (UNIFOR)**.

### Integrantes

- Samuel Barbosa
- Henrique Almeida
- Miguel Cavalcante

## Funcionalidades

- Explorar anúncios e buscar materiais acadêmicos.
- Filtrar anúncios por categoria e por doações.
- Criar uma conta, entrar e recuperar a senha.
- Publicar, editar e remover anúncios de venda ou doação.
- Acessar perfis de anunciantes e entrar em contato diretamente.
- Enviar imagens para os anúncios.

As conversas e combinações de entrega acontecem diretamente entre os estudantes; a plataforma não intermedeia pagamentos.

## Tecnologias

<table align="center">
  <thead>
    <tr>
      <th>Camada</th>
      <th>Tecnologias</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Front-end</td>
      <td>React, JavaScript, Vite e Tailwind CSS</td>
    </tr>
    <tr>
      <td>API</td>
      <td>Node.js, Express e Zod</td>
    </tr>
    <tr>
      <td>Banco de dados</td>
      <td>PostgreSQL com Supabase</td>
    </tr>
    <tr>
      <td>Autenticação</td>
      <td>JWT e bcrypt</td>
    </tr>
    <tr>
      <td>Imagens e e-mail</td>
      <td>Cloudinary e Resend</td>
    </tr>
  </tbody>
</table>

<p align="center">
  <img src="https://skillicons.dev/icons?i=js,react,vite,tailwind,nodejs,express,postgres,supabase&perline=4" alt="JavaScript, React, Vite, Tailwind CSS, Node.js, Express, PostgreSQL e Supabase">
</p>

## Como executar localmente

O front-end e a API são aplicações independentes, cada uma com seu próprio `package.json`. São necessários Node.js e npm.

### 1. Configurar o banco de dados

Crie um projeto no Supabase e execute os arquivos SQL na ordem indicada em [`supabase/README_SUPABASE.md`](supabase/README_SUPABASE.md). O `seed.sql` é opcional.

### 2. Configurar e iniciar a API

No diretório `server/`, crie um arquivo `.env` com base em `.env.example`. Preencha as credenciais do Supabase e defina um `JWT_SECRET` seguro. As integrações com Cloudinary e Resend devem ser configuradas caso você queira habilitar upload de imagens e envio de e-mails.

```bash
cd server
npm install
npm run dev
```

Por padrão, a API fica disponível em `http://localhost:3001`.

### 3. Configurar e iniciar o front-end

Em outro terminal, crie `client/.env` com base em `client/.env.example`. A variável `VITE_API_URL` deve apontar para a API — por padrão, `http://localhost:3001`.

```bash
cd client
npm install
npm run dev
```

O Vite disponibiliza o endereço local no terminal, normalmente `http://localhost:5173`.

## Scripts disponíveis

Na pasta `client/`:

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run preview` | Pré-visualiza a versão gerada |
| `npm run lint` | Executa o ESLint |

Na pasta `server/`:

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia a API em modo de desenvolvimento |
| `npm start` | Inicia a API |

## Estrutura do repositório

```text
client/    Aplicação web
server/    API REST
supabase/  Schema, políticas e scripts SQL
docs/      Documentação, entregas e protótipos
```

## Documentação

- [Índice da documentação](docs/README.md)
- [Arquitetura e configuração](docs/ai/ARCHITECTURE.md)
- [Documentação da API](server/README_API.md)
- [Configuração do banco de dados](supabase/README_SUPABASE.md)
- [Protótipos de tela](docs/prototype/screenshots/Home.png)

## Segurança

Não publique arquivos `.env` nem compartilhe chaves privadas. A `SUPABASE_SERVICE_ROLE_KEY`, o segredo JWT e as credenciais de serviços externos devem permanecer somente no ambiente do servidor.
