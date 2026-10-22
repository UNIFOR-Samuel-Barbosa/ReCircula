# Progresso dos requisitos do projeto

Considerando o estado atual do sistema/projeto e os requisitos da documentação, a situação está assim:

## Requisitos Funcionais

- [ x ] RF01 — Cadastro de usuário
- [ x ] RF02 — Login de usuário
- [ x ] RF03 — Logout
- [ x ] RF04 — Recuperação de senha
- [ x ] RF05 — Redefinição de senha
- [ x ] RF06 — Persistência e renovação de sessão
- [ x ] RF07 — Publicação de anúncio
- [ x ] RF08 — Upload de imagem para anúncio
- [ x ] RF09 — Listagem pública de anúncios
- [ x ] RF10 — Busca de anúncios por texto
- [ x ] RF11 — Filtro por categoria
- [ x ] RF12 — Filtro por doação
- [ x ] RF13 — Ordenação de anúncios
- [ x ] RF14 — Exclusão de anúncio
- [ x ] RF15 — Visualização do perfil próprio
- [ x ] RF16 — Visualização de perfil de outro usuário
- [ x ] RF17 — Edição de perfil
- [ x ] RF18 — Contato via WhatsApp
- [ x ] RF19 — Dashboard de anúncios do usuário

## Requisitos Não Funcionais

- [ x ] RNF01 — Autenticação e segurança de tokens
- [ x ] RNF02 — Autorização e controle de acesso
- [ x ] RNF03 — Validação de dados
- [ x ] RNF04 — Tratamento centralizado de erros
- [ x ] RNF05 — Performance — Cache Stale While Revalidate
- [ x ] RNF06 — Performance — Debounce de busca
- [ x ] RNF07 — Responsividade
- [ x ] RNF08 — Usabilidade — Feedback visual
- [ x ] RNF09 — Arquitetura em camadas (Backend)
- [ x ] RNF10 — Padronização em JavaScript (ES6+)
- [ x ] RNF11 — Escalabilidade da API
- [ x ] RNF12 — Upload de imagens
- [ x ] RNF13 — Implantação e infraestrutura

## Regras de Negócio

- [ x ] RN01 — Um anúncio marcado como doação não pode ter preço preenchido.
- [ x ] RN02 — O preço de um anúncio, quando informado, deve ser maior ou igual a zero.
- [ x ] RN03 — Somente o dono do anúncio pode editá-lo ou excluí-lo.
- [ x ] RN04 — Somente o dono do perfil pode editá-lo.
- [ x ] RN05 — O botão de contato via WhatsApp só é exibido ao visualizar o perfil de outro usuário.
- [ ] RN06 — Operações de escrita requerem conexão com a internet(tratamento de error amigável).
- [ x ] RN07 — O campo telefone é formatado automaticamente conforme o usuário digita.
- [ ] RN08 — A biografia do perfil está limitada a 150 caracteres tanto no backend quanto no campo de edição do frontend.
