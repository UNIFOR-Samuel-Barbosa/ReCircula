# Decisão de arquitetura: autenticação própria no backend

**Status:** adotada  
**Escopo:** autenticação de usuários e validação de identidade nas APIs do ReCircula.

## Contexto

O frontend acessa somente a API REST em Express, e a API acessa o PostgreSQL do Supabase com a Service Role Key. Nenhum cliente fala diretamente com o banco.

Foi considerado delegar a autenticação ao **Supabase Auth**, que gerencia cadastro, sessão e recuperação de senha e emite JWTs. A principal vantagem do Supabase Auth é integrar a identidade do usuário às políticas de Row Level Security (RLS), para que o próprio banco decida o que cada usuário pode acessar. Essa vantagem existe quando o navegador consulta o banco diretamente.

O enunciado da disciplina pede que a equipe implemente a autenticação e a autorização no backend (Etapa 3: "Desenvolvedor Back-end: Implementar autenticação, autorização").

## Decisão

O ReCircula usa **autenticação própria na API Express**. O Supabase é usado apenas como banco de dados.

- Senhas são armazenadas com **bcrypt** na coluna `profiles.password_hash` e nunca são devolvidas pela API.
- O login emite um **token de acesso** (JWT HS256, 15 minutos) com o ID do usuário (`sub`) e o papel (`role`), e um **token de renovação** opaco (7 dias).
- O token de renovação é **rotacionado** a cada uso. Reutilizar um token já trocado indica roubo e encerra todas as sessões do usuário.
- O banco guarda apenas o **hash SHA-256** dos tokens de renovação e de recuperação de senha.
- A recuperação de senha envia por e-mail um link de uso único, válido por 30 minutos. Redefinir a senha encerra todas as sessões.
- O middleware `authenticate` valida o JWT e disponibiliza `req.user = { id, role }`; `requireAdmin` restringe rotas administrativas.

## Fundamentação

- **Requisito da disciplina:** a autenticação e a autorização fazem parte do que deve ser implementado e avaliado no backend.
- **Arquitetura com backend intermediário:** como só a API acessa o banco, e a Service Role Key ignora RLS, a integração do Supabase Auth com RLS não traria benefício. Todas as regras de acesso ficam em um só lugar, o backend.
- **RLS como barreira extra:** todas as tabelas têm RLS habilitado sem políticas, de modo que as chaves `anon`/publicável não leem nem alteram nenhum dado.
- **Cuidados de segurança adotados:** hash bcrypt das senhas; mesma mensagem de erro para e-mail inexistente e senha incorreta; mesma resposta na recuperação de senha, exista ou não o e-mail; tokens de acesso curtos; rotação e detecção de reuso dos tokens de renovação; links de recuperação de uso único; segredos apenas em variáveis de ambiente do servidor.

## Efeitos no ReCircula

- A API expõe `/auth/register`, `/auth/register-admin`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/forgot-password` e `/auth/reset-password` (ver [rotas_backend.md](../arquitetura/api/rotas_backend.md)).
- O frontend não usa o SDK do Supabase. Ele guarda os tokens recebidos, envia `Authorization: Bearer <accessToken>` nas rotas protegidas e, ao receber `401`, chama `/auth/refresh` uma vez e repete a requisição.
- O banco possui as tabelas `refresh_tokens` e `password_resets`, além de `email`, `password_hash` e `role` em `profiles` (ver `supabase/schema.sql`).
- O servidor precisa das variáveis `JWT_SECRET`, `ADMIN_SIGNUP_CODE`, `FRONTEND_URL` e, para o envio de e-mails, `RESEND_API_KEY`.

## Limitações conhecidas

- Ainda não há limite de tentativas (rate limiting) em login e recuperação de senha.
- Não há confirmação de e-mail no cadastro (não é exigida pelos requisitos).
- Duas abas renovando a sessão ao mesmo tempo podem ser interpretadas como reuso do token e encerrar a sessão; o frontend deve evitar renovações simultâneas.
