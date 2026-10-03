# Cronograma de Desenvolvimento — ReCircula

**Prazo:** 4 semanas (20 dias úteis)  
**Objetivo:** entregar o MVP full-stack funcional, testado e publicado até o fim da quarta semana.

## Distribuição da equipe

| Integrante            | Frente principal                         |
| --------------------- | ---------------------------------------- |
| Samuel Miguel Barbosa | Frontend, UX/UI, coordenação, autenticação e QA frontend |
| Henrique Lima         | Backend, autenticação e perfis           |
| Miguel Cavalcante     | Backend, banco de dados e anúncios       |

## Telas e fluxos considerados

Há **7 imagens de protótipo** disponíveis em `docs/prototype/screenshots`: Home, Sing In, Sing Up, Recovery, To Announce, Dashboard e Profile. Para atender aos requisitos, o desenvolvimento considera **8 fluxos/estados de tela**: essas 7 telas + mais redefinição de senha. Profile contempla os estados de perfil próprio e de outro usuário; não são necessários protótipos adicionais para implementá-los.

## Semana 1 — Fundação e contratos

| Integrante | Área                   | Tarefa e objetivo                                                                                                                                                                                                        |
| ---------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Samuel     | Frontend / UX / gestão | Definir rotas e estrutura da aplicação React, layout compartilhado, navegação responsiva e componentes visuais comuns. Implementar as telas de login e cadastro responsivas, com validação e estados de carregamento/erro. Registrar critérios de aceite e alinhar com o backend o formato das respostas e erros da API. |
| Henrique   | Backend                | Inicializar Express e a estrutura Routes → Middlewares → Controllers → Services → Repository; configurar variáveis de ambiente, middleware global de erros e validação Zod. Implementar cadastro/login com bcrypt e JWT. |
| Miguel     | Backend / banco        | Criar scripts versionados de schema e seed no Supabase para `profiles` e `announces`, com chaves, restrições de preço/doação e cascata. Preparar repositórios e acesso ao banco sem expor credenciais.                   |

**Marco da semana:** aplicação e API inicializadas, banco reproduzível por scripts e contrato inicial dos endpoints acordado, incluindo recuperação/redefinição de senha, renovação do token e consulta autenticada do perfil de outro usuário.

## Semana 2 — Autenticação e vitrine pública

| Integrante | Área     | Tarefa e objetivo                                                                                                                                                                                                                                 |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Samuel     | Frontend | Implementar Landing Page e vitrine de anúncios, incluindo cartões responsivos, busca com debounce de 500 ms, filtros por categoria/doação, ordenação e estados vazios/erro. Preparar cache por parâmetros com atualização em segundo plano (SWR). Conectar login e cadastro à API, tratar persistência da sessão e redirecionamento após autenticação; concluir a tela de solicitação de recuperação de senha. |
| Henrique   | Backend  | Completar login/cadastro e autorização JWT; implementar persistência/renovação de sessão, logout e recuperação/redefinição de senha com envio de link ou código. Manter segredos e configuração do provedor de e-mail no backend.                 |
| Miguel     | Backend  | Implementar `GET /announces` com filtros combináveis (texto, categoria, doação, ordenação e usuário), `GET /announces/:id` e listagem de categorias derivadas dos anúncios. Validar entradas com Zod e padronizar respostas.                      |

**Marco da semana:** visitante consulta a vitrine filtrada; usuário pode criar conta, entrar, sair e iniciar recuperação de acesso.

## Semana 3 — Publicação, painel e perfis

| Integrante | Área          | Tarefa e objetivo                                                                                                                                                                                                                                              |
| ---------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Samuel     | Frontend / QA | Implementar os formulários de anúncio, Dashboard e Profile; conectar criação/edição/exclusão ao backend, exibir confirmação antes de excluir e separar os estados de perfil próprio e público. Incluir botão contextual de WhatsApp no perfil de outra pessoa. Revisar responsividade e validações das telas de autenticação em celular e desktop, corrigir problemas encontrados e verificar os fluxos conectados de login, cadastro e recuperação. |
| Henrique   | Backend       | Implementar consulta e edição do perfil próprio e consulta autenticada de perfil por ID; validar nome, biografia e telefone, proteger alterações pelo dono, ocultar telefone/email nas respostas de perfil alheio e integrar foto ao upload.                   |
| Miguel     | Backend       | Completar criação, edição e exclusão de anúncios com autorização por proprietário; implementar upload `multipart/form-data` com Multer e armazenamento Cloudinary para anúncio e foto de perfil. Validar preço, doação e imagem obrigatória.                   |

**Marco da semana:** usuário autenticado publica e gerencia seus anúncios; perfis e imagens estão integrados aos serviços externos.

## Semana 4 — Integração, qualidade e publicação

| Integrante | Área                        | Tarefa e objetivo                                                                                                                                                                                                   |
| ---------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Samuel     | Frontend / gestão / QA      | Integrar e revisar os fluxos ponta a ponta, finalizar estados de carregamento/toasts independentes e responsividade. Executar regressão visual nas telas de autenticação e nos fluxos mobile; registrar e corrigir defeitos de interface. Publicar o frontend na Vercel, coordenar correções finais e preparar demonstração e relatório. |
| Henrique   | Backend / qualidade         | Testar autenticação, recuperação, autorização, validações e tratamento de erros; corrigir falhas e publicar a API no Render com variáveis de ambiente configuradas.                                                 |
| Miguel     | Backend / banco / qualidade | Testar filtros combinados, CRUD, uploads e regras de propriedade; validar execução dos scripts SQL em ambiente limpo, apoiar o deploy da API e corrigir falhas de integração.                                       |

**Marco final:** aplicação publicada na Vercel, API no Render e banco Supabase reproduzível; fluxos prioritários validados em desktop e celular.

## Critérios de conclusão

- Cadastro, login, logout, sessão persistente e recuperação/redefinição de senha funcionam.
- Vitrine pública permite busca, filtros combinados e ordenação; Dashboard lista apenas anúncios do usuário.
- Publicação, edição e exclusão respeitam validações e autorização do proprietário.
- Perfil próprio e consulta autenticada de perfis alheios, contato via WhatsApp sem exibição do número e upload de imagens estão funcionais.
- Interface responsiva, feedback de carregamento/erro/sucesso e scripts SQL versionados.
- Frontend e backend publicados, com segredos fora do repositório.

## Rotina de acompanhamento

- Check-in curto diário para impedimentos e dependências entre frontend e backend.
- Revisão do marco ao fim de cada semana; mudanças de contrato da API devem ser comunicadas aos responsáveis de frontend.
- Reservar os últimos 3 dias úteis para integração, correções e ensaio da apresentação; não iniciar funcionalidades novas nesse período.
