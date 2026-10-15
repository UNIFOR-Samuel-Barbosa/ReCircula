# Modelo de dados

Fonte de verdade: `supabase/schema.sql`; políticas e grants estão em `supabase/policies.sql`.

## Tabelas

| Tabela | Responsabilidade e relações |
| --- | --- |
| `profiles` | Conta e perfil. `id` UUID; e-mail único, minúsculo e obrigatório; `password_hash` obrigatório; nome, foto, biografia e telefone; `role` restrito a `user`/`admin`; data de criação. |
| `announces` | Anúncio associado a `profiles.id` via `user_id`, com exclusão em cascata. Guarda imagem, título, descrição, categoria, preço não negativo/nullable, flag `donation` e data de criação. |
| `refresh_tokens` | Sessões de renovação associadas ao perfil; token guardado como hash, expiração e revogação. |
| `password_resets` | Tokens de redefinição associados ao perfil; hash, expiração e data de uso. |

Índices de `refresh_tokens.user_id` e `password_resets.user_id` estão definidos no schema. `pgcrypto` é habilitado pelo schema para uso no seed.

## RLS

- O SQL habilita RLS nas quatro tabelas. `policies.sql` inclui policies de leitura pública para perfis/anúncios, atualização/gestão por identidade Supabase e operação administrativa; tabelas de tokens não recebem policies de leitura/escrita para clientes.
- A API usa a Service Role Key, que não é limitada por policies RLS. Autorização efetiva das requisições da API é implementada nos middlewares/services e não deve depender dessas policies.
- O script também define grants de colunas para perfis; confira o SQL completo antes de mudar políticas ou exposição de campos. A descrição de RLS em `docs/decisoes/Auth.md` está desatualizada (ver [KNOWN_ISSUES.md](./KNOWN_ISSUES.md)).

## Cuidados

- Senhas nunca devem sair da API; `profile.repository.js` usa uma projeção sem `password_hash` para a maioria das leituras e só a busca de login inclui o hash.
- Confirme as projeções públicas/privadas nos repositories e controllers antes de alterar perfil ou anúncio: algumas respostas atuais divergem do contrato documentado.
- `supabase/reset.sql` remove estruturas existentes; use somente em ambiente de desenvolvimento e após confirmar o alvo.
