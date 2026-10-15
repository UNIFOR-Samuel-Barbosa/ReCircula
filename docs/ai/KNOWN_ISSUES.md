# Lacunas e divergências verificadas

Este arquivo registra fatos que exigem atenção ao alterar implementação ou documentação; não substitui validação de segurança.

## Contratos e decisões desatualizados

- `docs/arquitetura/api/rotas_backend.md` ainda descreve `/profiles/me` e restringe `/profiles/:id` a usuário autenticado. As rotas implementadas são `GET /profiles` (autenticado), `GET /profiles/all` (admin), `GET /profiles/:id` (sem autenticação), `PATCH /profiles` (autenticado) e `DELETE /profiles/:id` (admin).
- O mesmo contrato diz que respostas públicas omitem telefone/e-mail. `profile.repository.js` seleciona `email` e `telephone` para `findById`, usado pelo endpoint público `/profiles/:id`; `announce.repository.js` inclui `telephone` no perfil aninhado de `GET /announces/:id`. O comportamento merece revisão antes de assumir proteção desses dados.
- `docs/decisoes/Auth.md` afirma que RLS está habilitado sem policies; `supabase/policies.sql` atualmente define várias policies e grants. A API usa a Service Role Key, então suas autorizações são aplicadas no servidor, não por essas policies.
- `docs/arquitetura/relatorios/Escopo_do_Sistema.md` chama a SPA de “tipada”, mas a aplicação é JavaScript/JSX e não há TypeScript declarado. Shadcn/ui é usado como padrão/código local com Radix, sem CLI/pacote `shadcn` ou `components.json`.

## Comportamentos e configuração a confirmar

- `client/src/routes/marketplace/index.jsx` substitui catálogo vazio ou falha da API por dados demonstrativos; isso pode mascarar uma indisponibilidade ou banco sem anúncios.
- Em `server/src/app.js`, o callback CORS termina aceitando qualquer origem (`callback(null, true)` também no caso não listado), apesar de construir uma lista de origens permitidas. Não documente essa lista como allowlist efetiva sem revisar a configuração.
- Vercel/Render são citados no escopo, mas não foi encontrada configuração de deploy no repositório.
- Os manifests não definem scripts de teste; nenhuma validação de build, lint ou integração com serviços remotos foi executada nesta atualização.
