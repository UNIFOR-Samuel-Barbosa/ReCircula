# Fluxos da aplicação

## Sessão e autenticação

1. `AuthContext` expõe login, cadastro, cadastro admin, logout e sincronização do perfil.
2. `authApi` em `client/src/services/api.js` chama `/auth/*` e guarda access token, refresh token e usuário em `localStorage`.
3. Requisições autenticadas enviam `Authorization: Bearer ...`. Em `401`, `apiRequest` coordena uma renovação compartilhada (`refreshPromise`) e tenta novamente uma vez; falha de renovação limpa a sessão.
4. A API aplica bcrypt às senhas, emite JWT de acesso e armazena hashes de refresh/reset tokens. Refresh é rotacionado; reuso revoga as sessões do usuário.
5. Recuperação usa `/auth/forgot-password` e `/auth/reset-password`; o link aponta para `/redefinir-senha`, rota registrada no cliente.

Referências: `client/src/context/AuthContext.jsx`, `client/src/services/api.js`, `server/src/routes/auth.routes.js`, `server/src/services/auth.service.js`, `server/src/services/token.service.js`.

## Anúncios

- A vitrine chama `GET /announces`; filtros de busca, categoria, doação e preço são aplicados na tela. Se a API falhar ou retornar lista vazia, a tela usa `client/src/lib/demo-data.js`.
- Detalhes de anúncio consultam a API por ID.
- Publicar exige sessão: envia a imagem a `POST /upload`, então cria o anúncio em `POST /announces` usando a URL retornada pelo Cloudinary.
- O painel pessoal lista via `GET /announces/me` e exclui via `DELETE /announces/:id`.
- O service da API define o proprietário a partir de `req.user.id`; edição/exclusão verificam propriedade, com exceção administrativa para exclusão.

## Perfis e administração

- O cliente carrega/atualiza o perfil atual em `/profiles` e consulta perfil por ID em `/profiles/:id`.
- Avatar/foto é enviado a `/upload` antes de salvar a URL no perfil.
- O painel admin usa `GET /profiles/all`, consulta anúncios e exclui usuários ou anúncios. A API exige `authenticate` e `requireAdmin` nas rotas administrativas.
- Atualmente, `GET /profiles/:id` não tem middleware de autenticação; confira a exposição de campos e a divergência contratual em [KNOWN_ISSUES.md](./KNOWN_ISSUES.md).

## Upload

`POST /upload` exige autenticação, processa multipart com Multer, valida MIME/tamanho em `server/src/services/storage.service.js` e envia ao Cloudinary. PNG, JPEG e WEBP até 10 MB são aceitos no cliente e no service.
