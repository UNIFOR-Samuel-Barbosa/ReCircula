# Decisão de arquitetura: autenticação com Supabase Auth

**Status:** adotada  
**Escopo:** autenticação de usuários e validação de identidade nas APIs do ReCircula.

## Contexto

O planejamento inicial atribuía ao backend Express o cadastro e login, a geração e validação de JWTs, o armazenamento de senhas com hash e os fluxos de renovação e recuperação. Isso exigiria que o projeto implementasse e mantivesse partes sensíveis de um sistema de autenticação.

JWT e bcrypt não são alternativas para a mesma função: JWT é o formato dos tokens de sessão/identidade; bcrypt é um algoritmo de hash unidirecional usado para armazenar senhas. A decisão, portanto, não é “trocar bcrypt por JWT”, mas delegar o ciclo de autenticação ao Supabase Auth, que emite JWTs e gerencia a autenticação por senha.

## Decisão

O ReCircula usará **Supabase Auth como provedor de identidade**, em vez de criar autenticação própria no backend. O frontend usará o SDK do Supabase para cadastro, login, logout, manutenção da sessão e recuperação/redefinição de senha. O Supabase Auth emitirá e renovará os JWTs da sessão.

As rotas protegidas da API Express continuarão validando o token recebido no cabeçalho `Authorization`. O backend deve verificar a assinatura e as claims do JWT emitido pelo projeto Supabase usando mecanismos e bibliotecas suportados pelo Supabase; não deve emitir tokens próprios nem confiar apenas em decodificar o conteúdo do JWT. O identificador validado (`sub`/ID do usuário) será a fonte de identidade para autorização e propriedade dos recursos.

Os perfis e os dados do marketplace permanecem em tabelas próprias no PostgreSQL. `profiles.id` deve corresponder ao UUID de `auth.users.id`, com uma chave estrangeira para essa identidade. A tabela `profiles` guarda dados de apresentação e contato do ReCircula, nunca a senha nem uma cópia do hash da senha.

## Fundamentação

- **Menos código crítico próprio:** cadastro, login, sessão, refresh token, confirmação de e-mail e recuperação de senha são responsabilidades do provedor, reduzindo a quantidade de lógica de segurança que a equipe precisa escrever, testar e manter.
- **Integração de identidade e autorização:** o Supabase Auth emite JWTs que os serviços Supabase podem usar com políticas de Row Level Security (RLS). Isso permite associar regras no PostgreSQL à identidade autenticada, como limitar alterações de anúncios ao seu proprietário.
- **Verificação padronizada:** o backend valida tokens emitidos pelo mesmo provedor que administra a sessão. A validação deve usar `getClaims()` ou uma biblioteca JWT apropriada, de acordo com a configuração de chaves do projeto, e não uma implementação criptográfica própria.
- **Menor exposição de credenciais:** o aplicativo não mantém hashes de senha nem um segredo JWT próprio. A chave `service_role`/secret do Supabase, que pode ignorar RLS, nunca deve ser enviada ao navegador; no frontend usa-se apenas a chave publicável/anon apropriada, sempre em conjunto com políticas de acesso.
- **Entrega mais rápida:** a equipe concentra o trabalho nas regras próprias do marketplace e nas telas, em vez de desenvolver e depurar fluxos completos de autenticação. Os recursos prontos de recuperação de acesso e sessão também reduzem o trabalho de curto prazo.
- **Hash de senha continua existindo:** no serviço Supabase Auth, senhas são armazenadas como hashes, não em texto puro. A implementação atual do Supabase Auth gera hashes bcrypt (com custo padrão da biblioteca) e também reconhece formatos de hash adicionais para compatibilidade. Assim, bcrypt não é removido do mecanismo interno de proteção de senha; deixa apenas de ser implementado e operado pelo ReCircula. O algoritmo interno é responsabilidade do provedor e pode evoluir.

## Efeitos no ReCircula

### Curto prazo

- Substituir os handlers próprios de cadastro, login, logout, refresh e recuperação por chamadas ao SDK do Supabase Auth.
- Configurar no frontend a URL e a chave publicável do projeto; manter chaves privilegiadas e quaisquer credenciais de serviço somente em ambiente confiável de servidor.
- Implementar no Express middleware de autenticação que rejeite tokens ausentes, inválidos ou expirados e disponibilize a identidade verificada aos handlers.
- Criar o perfil associado ao UUID de `auth.users` no fluxo de cadastro, com tratamento explícito de falhas para não deixar a conta sem perfil.
- Definir políticas RLS para `profiles` e `announces` coerentes com os acessos públicos e autenticados previstos, além de manter validação e autorização no backend quando aplicável.
- Ajustar o contrato da API: operações de autenticação são responsabilidade do Supabase Auth, não endpoints próprios `/auth/*` do Express.

### Segurança e limites

Delegar autenticação diminui a superfície de código sensível e aproveita a manutenção e os controles do serviço, mas não torna o aplicativo seguro automaticamente. A equipe continua responsável por validar JWTs corretamente, aplicar menor privilégio, proteger chaves, configurar URLs de redirecionamento e políticas RLS, tratar erros sem revelar se um e-mail está cadastrado e testar acessos permitidos e negados. A chave de serviço nunca deve ser usada no navegador. A autorização de negócio e as regras de propriedade continuam sendo responsabilidade do ReCircula.

## Referências oficiais

- [Supabase Auth — visão geral](https://supabase.com/docs/guides/auth): Auth usa JWTs e integra a identidade a RLS e aos serviços Supabase.
- [Password-based Auth](https://supabase.com/docs/guides/auth/passwords): fluxos de cadastro e autenticação com e-mail e senha.
- [JSON Web Tokens](https://supabase.com/docs/guides/auth/jwts): emissão e verificação de tokens; recomenda mecanismos de verificação apropriados.
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security): políticas de autorização por linha e uso de `auth.uid()`.
- [Supabase Auth — repositório oficial](https://github.com/supabase/auth): descreve Auth como serviço responsável por emitir JWTs e recomenda o serviço gerenciado para evitar a operação própria de autenticação.
- [Implementação de hash de senha](https://github.com/supabase/auth/blob/master/internal/crypto/password.go): implementação atual de geração de hash bcrypt e verificação de hashes.