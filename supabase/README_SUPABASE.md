# Supabase Database

Esta pasta contém todos os arquivos necessários para recriar a estrutura do banco de dados do projeto **ReCircula**.

## Estrutura

```text
supabase/
├── schema.sql
├── policies.sql
├── seed.sql
├── reset.sql
└── README.md
```

## Ordem de execução

Caso esteja criando um novo projeto no Supabase, execute os arquivos na seguinte ordem:

1. `schema.sql`
2. `policies.sql`
3. `seed.sql` _(opcional)_

O arquivo `reset.sql` pode ser utilizado durante o desenvolvimento para remover as tabelas existentes e recriá-las do zero.

---

## Arquivos

### `schema.sql`

Responsável por criar toda a estrutura do banco de dados:

- tabela `profiles`;
- tabela `announces`;
- relacionamentos;
- chaves primárias;
- chaves estrangeiras;
- constraints.

---

### `policies.sql`

Habilita o **Row Level Security (RLS)** e cria as políticas de acesso das tabelas.

Mesmo utilizando a **Service Role Key** no backend, manter as policies documentadas facilita futuras migrações para clientes utilizando a chave pública (`anon key`).

---

### `seed.sql`

Insere registros de exemplo para facilitar testes durante o desenvolvimento.

Este arquivo é opcional e pode ser executado quantas vezes forem necessárias após limpar o banco.

---

### `reset.sql`

Remove as tabelas do projeto para permitir uma recriação completa do banco.

Utilize este arquivo apenas durante o desenvolvimento.

---

## Variáveis de ambiente do Backend

O servidor utiliza as seguintes variáveis de ambiente:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
PORT=3001
```

A **Service Role Key** deve permanecer exclusivamente no backend e **nunca** ser exposta ao frontend.

---

## Tecnologias

- Supabase
- PostgreSQL
- Row Level Security (RLS)

---

## Observações

- O frontend acessa exclusivamente a API REST desenvolvida em `server/`.
- Toda comunicação com o banco ocorre através do backend.
- O backend utiliza a **Service Role Key** para executar operações administrativas com segurança.
- As policies permanecem versionadas para facilitar manutenção, auditoria e futuras evoluções do projeto.
