# Contextos de IA

Documentação modular para orientar mudanças no ReCircula. [AI_CONTEXT.md](../../AI_CONTEXT.md) é o índice principal; consulte apenas os guias relacionados à tarefa e valide os detalhes no código.

| Guia | Consultar quando |
| --- | --- |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Navegar entre cliente, API e integrações. |
| [DATA_MODEL.md](./DATA_MODEL.md) | Alterar tabelas, relações, campos ou políticas RLS. |
| [WORKFLOWS.md](./WORKFLOWS.md) | Alterar autenticação, anúncios, perfis ou upload. |
| [OPERATIONS.md](./OPERATIONS.md) | Executar cliente/servidor ou configurar ambiente local. |
| [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) | Checar divergências entre implementação e documentos existentes. |

## Fontes de verdade

- Código e scripts SQL representam o comportamento implementado.
- Os documentos em `docs/arquitetura/` e `server/README_API.md` descrevem intenção/contratos, mas podem estar desatualizados; compare com as rotas atuais.
- Não inferir que serviços remotos, deploy, build ou testes funcionam sem verificá-los.
