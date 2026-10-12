# Contrato Inicial de Rotas — ReCircula

Este documento descreve as rotas planejadas para a API REST do ReCircula. Rotas marcadas como autenticadas exigem um JWT emitido pelo Supabase Auth no cabeçalho `Authorization`. O cadastro, login, logout, renovação de sessão e recuperação de senha são realizados pelo Supabase Auth via SDK; o backend Express não implementa endpoints próprios de autenticação nem armazena senhas. Seu middleware valida o token e usa a identidade verificada para autorização.

## Autenticação e sessão

O frontend usa o SDK do Supabase Auth para cadastro com qualquer e-mail válido, login, logout, atualização da sessão e recuperação/redefinição de senha. Esses fluxos não são endpoints da API Express. Após validar o JWT em cada rota protegida, o backend obtém a identidade do usuário das claims verificadas; não deve confiar em um `user_id` enviado pelo cliente.

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
- Manter chaves privilegiadas do Supabase e credenciais de serviços externos em variáveis de ambiente do servidor; nunca expor `service_role`/secret no frontend. A chave publicável usada pelo frontend não substitui políticas RLS.

O Supabase Auth controla a expiração e a renovação de sessão. O backend deve verificar JWTs conforme a configuração de chaves do projeto, usando uma biblioteca ou mecanismo suportado, e não deve compartilhar ou armazenar a chave privada de assinatura.
