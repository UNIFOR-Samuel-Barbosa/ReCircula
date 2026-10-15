# Execução e configuração

## Instalação e scripts

Cliente e servidor têm manifests independentes; execute os comandos no diretório indicado:

| Diretório | Instalação | Desenvolvimento | Outros scripts verificados |
| --- | --- | --- | --- |
| `client/` | `npm install` | `npm run dev` | `npm run build`, `npm run lint`, `npm run preview` |
| `server/` | `npm install` | `npm run dev` | `npm start` |

Vite usa a porta padrão 5173. O servidor usa `PORT` ou 3001. Os manifests não declaram scripts de teste.

## Ambiente

- Cliente: `client/.env.example` define `VITE_API_URL`; o código usa `http://localhost:3001` se não estiver definido.
- Servidor: nomes declarados em `server/.env.example`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `VERCEL_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `JWT_SECRET`, `JWT_ACCESS_EXPIRES`, `REFRESH_TOKEN_DAYS`, `ADMIN_SIGNUP_CODE`, `FRONTEND_URL`, `RESEND_API_KEY`, `MAIL_FROM`, `PORT`.
- `JWT_SECRET` é obrigatório. Configurações de duração do JWT, refresh, URL frontend, remetente e porta têm defaults no código; confira `server/src/config/auth.js`, `server/src/services/mail.service.js` e `server/src/server.js`.
- Não copie valores de `.env` nem exponha a Service Role Key ou credenciais do Cloudinary no frontend.

## Banco

Para preparar um Supabase novo, a documentação indica `schema.sql`, depois `policies.sql` e opcionalmente `seed.sql`. Não execute `reset.sql` em banco com dados que devam ser preservados; ele é destrutivo.

## Deploy e validação

- O escopo menciona Vercel e Render, mas não foi localizada configuração de deploy versionada.
- Não foram executados build, lint, testes ou conexões remotas durante a atualização do contexto. Verifique no ambiente de desenvolvimento antes de considerar a instalação operacional.
