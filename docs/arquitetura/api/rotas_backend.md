# Contrato Inicial de Rotas — ReCircula

Este documento descreve as rotas planejadas para a API REST do ReCircula. Rotas marcadas como autenticadas exigem `Authorization: Bearer <access_token>`, exceto a renovação, que usa o token de renovação. O backend gera JWT e verifica senhas armazenadas com bcrypt; o Supabase é utilizado como banco de dados, não como provedor de autenticação.

## Autenticação e sessão

| Método | Rota | Acesso | Entrada e finalidade |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Público | Recebe e-mail e senha; aceita qualquer endereço de e-mail válido, sem exigir domínio universitário; cria a conta e o perfil. |
| `POST` | `/auth/login` | Público | Recebe e-mail e senha; verifica a senha com bcrypt e emite os tokens de sessão. |
| `POST` | `/auth/logout` | Autenticado | Encerra a sessão e invalida o token de renovação associado. |
| `POST` | `/auth/refresh` | Token de renovação | Renova o token de acesso a partir de um token de renovação válido. |
| `POST` | `/auth/forgot-password` | Público | Recebe e-mail e inicia o envio de link/código de recuperação. A resposta não deve revelar se o e-mail está cadastrado. |
| `POST` | `/auth/reset-password` | Token de recuperação | Recebe token/código e nova senha; atualiza a senha armazenada com bcrypt. |

## Anúncios

| Método | Rota | Acesso | Entrada e finalidade |
| --- | --- | --- | --- |
| `GET` | `/announces` | Público | Lista anúncios; aceita filtros opcionais `search`, `category`, `donation`, `sort` e `user_id`. |
| `GET` | `/announces/:id` | Público | Retorna os dados de um anúncio pelo identificador. Não expõe e-mail nem telefone do anunciante. |
| `POST` | `/announces` | Autenticado | Cria anúncio. O proprietário é determinado pelo usuário autenticado; imagem é enviada pelo fluxo de upload. |
| `PATCH` | `/announces/:id` | Autenticado, proprietário | Atualiza os campos permitidos do anúncio identificado. O backend valida a propriedade antes de alterar. |
| `DELETE` | `/announces/:id` | Autenticado, proprietário | Exclui o anúncio após confirmação na interface. O backend valida a propriedade. |

`sort` aceita `recent`, `price-asc` ou `price-desc`. `donation` é booleano. A busca textual considera o título. Os filtros podem ser combinados; `user_id` permite limitar resultados aos anúncios de um perfil, inclusive no dashboard autenticado.

## Perfis

| Método | Rota | Acesso | Entrada e finalidade |
| --- | --- | --- | --- |
| `GET` | `/profiles/me` | Autenticado | Consulta o perfil do usuário atual. Dados privados necessários para edição, como e-mail e telefone, ficam disponíveis somente ao próprio usuário. |
| `PATCH` | `/profiles/me` | Autenticado | Atualiza o próprio nome, biografia, telefone e foto. Não aceita alterar o perfil de outro usuário. |
| `GET` | `/profiles/:id` | Autenticado | Consulta o perfil de outro usuário pelo identificador. Visitantes não autenticados não têm acesso. A resposta omite e-mail e telefone e pode incluir um link de WhatsApp para uso pelo botão de contato, sem exibir o número como texto na interface. |

## Upload

| Método | Rota | Acesso | Entrada e finalidade |
| --- | --- | --- | --- |
| `POST` | `/upload` | Autenticado | Recebe imagem em `multipart/form-data`, processa com Multer, armazena no Cloudinary e retorna a URL segura para associar ao anúncio ou perfil. |

## Validação, autorização e erros

- Validar os dados recebidos no backend com Zod.
- Usar o identificador do usuário autenticado para definir a propriedade de anúncios e perfis; não confiar em `user_id` enviado pelo cliente para operações de escrita.
- Retornar erros HTTP semânticos. Entradas inválidas retornam `400`, falta de autenticação `401`, falta de autorização `403`, recurso inexistente `404`, erro interno `500` e indisponibilidade de serviço ou banco `503`.
- Não retornar e-mail ou telefone de terceiros nas respostas de listagem de anúncios ou de consulta de perfil.
- Manter credenciais do banco, segredo JWT e credenciais dos serviços externos em variáveis de ambiente do backend.

Os nomes e formatos finais dos payloads, a política de expiração dos tokens e os detalhes do armazenamento/invalidação de tokens de renovação devem ser definidos durante a implementação, mantendo os requisitos de segurança descritos acima.
