# Rotas

As telas são componentes React agrupados por domínio. A tabela explícita em
`src/router.jsx` associa os caminhos públicos aos componentes; parâmetros
dinâmicos são definidos com segmentos `:param`.

| Grupo          | Arquivos                                   | URLs públicas                             |
| -------------- | ------------------------------------------ | ----------------------------------------- |
| `marketplace/` | vitrine, publicação e anúncio              | `/`, `/publicar`, `/anuncio/:id`          |
| `auth/`        | login e cadastros                          | `/entrar`, `/cadastro`, `/cadastro-admin` |
| `profile/`     | perfil, anúncios pessoais e perfil público | `/perfil`, `/painel`, `/usuario/:id`      |
| `admin/`       | administração                              | `/dashboard`                              |

O componente `AppRouter` trata navegação interna, histórico do navegador,
parâmetros dinâmicos, títulos e a tela 404. Novos caminhos devem ser registrados
em `src/router.jsx`.
