# ReCircula — Marketplace de Economia Circular Universitário

> **Disciplina:** Desenvolvimento Web  
> **Instituição:** Universidade de Fortaleza (UNIFOR)  
> **Etapa 1:** Plano de Trabalho — Projeto Inicial

---

## 📌 1. Planejamento do Projeto

### 1.1. Escopo do Sistema

#### Visão Geral e Contexto do Problema

O **ReCircula** é uma plataforma web responsiva concebida para fomentar a sustentabilidade e a economia circular no ecossistema acadêmico. Semestralmente, milhares de estudantes universitários deparam-se com custos elevados na aquisição de materiais didáticos e laboratoriais (livros, calculadoras científicas, componentes eletrônicos, jalecos, pranchetas e apostilas), ao mesmo tempo em que veteranos e concluintes acumulam itens ociosos sem um canal centralizado e confiável para doação ou revenda acessível.

O sistema surge para solucionar esse gargalo, eliminando o ruído e a ineficiência de grupos informais de mensagens, oferecendo um ambiente seguro, organizado e focado exclusivamente na comunidade do campus.

---

#### Funcionalidade Principal

A funcionalidade central do **ReCircula** é atuar como um **Marketplace Colaborativo e Ponto de Encontro de Economia Circular**, viabilizando:

1. **Vitrine Pública de Anúncios:** Catálogo interativo aberto para consulta com busca textual instantânea (_debounce_), filtros por categorias acadêmicas (Livros, Engenharia, Computação, Jalecos, Eletrônicos, etc.) e seleção exclusiva para itens de **Doação** ou venda com preços justos.
2. **Ciclo Completo de Anúncios (CRUD):** Estudantes autenticados podem cadastrar anúncios com upload de imagens reais, descrição, preço ou flag explícita de gratuidade/doação, além de gerenciar ou excluir suas próprias publicações em um painel (_dashboard_).
3. **Ponte de Conexão Direta (Comprador-Vendedor):** Em vez de reter pagamentos ou intermediar transações financeiras complexas, o sistema foca no modelo _peer-to-peer_ (P2P) local: conecta os estudantes diretamente via link seguro para WhatsApp com mensagem contextualizada, permitindo que a entrega ocorra presencialmente nos blocos ou pontos de encontro do próprio campus.
4. **Perfis Acadêmicos Públicos:** Identificação dos anunciantes com biografia, foto de perfil, telefone de contato e histórico de desapegos ativos, transmitindo credibilidade e senso de comunidade.

---

#### Público-Alvo

O sistema é projetado sob medida para o público do ambiente universitário, segmentado em:

- **Estudantes Ingressantes (Calouros):** Alunos que buscam economizar na aquisição de itens obrigatórios para o início do curso (livros-texto, ferramentas de laboratório, calculadoras e jalecos).
- **Estudantes Veteranos e Concluintes:** Alunos em semestres avançados que não utilizam mais materiais das fases iniciais e desejam recuperar parte do investimento ou praticar o desapego solidário.
- **Comunidade Acadêmica Ampla:** Monitores, professores e pesquisadores interessados no reaproveitamento e doação de componentes de hardware, materiais de desenho técnico, livros e mobiliário universitário.

---

#### Tecnologias Utilizadas

A arquitetura do projeto foi planejada adotando o padrão **Full-Stack desacoplado**, garantindo alta performance, segurança, modularidade e facilidade de manutenção:

| Camada                     | Tecnologia                         | Justificativa Técnica                                                                                                                                                                    |
| :------------------------- | :--------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Front-end**              | **React.js & JavaScript**          | Criação de uma Single Page Application (SPA) reativa, modular e tipada, proporcionando experiência fluida e componentização reutilizável.                                                |
| **Estilização & UI**       | **Tailwind CSS**                   | Design mobile-first ágil, moderno e responsivo, assegurando compatibilidade perfeita entre telas desktop e dispositivos móveis (com estrutura preparada para PWA).                       |
| **Back-end (API)**         | **Node.js & Express (JavaScript)** | Construção de uma API RESTful escalável, de alta performance assíncrona, estruturada no padrão de arquitetura em camadas (_Routes_, _Controllers_, _Services_, _Repositories_).          |
| **Validação de Dados**     | **Zod**                            | Validação estrita de esquemas e sanitização de payloads de entrada no back-end, garantindo integridade e prevenindo dados inconsistentes.                                                |
| **Banco de Dados**         | **PostgreSQL (Supabase)**          | Banco relacional robusto para garantir consistência relacional (tabelas `profiles` e `announces`), integridade referencial com chave estrangeira e suporte a _Row Level Security_ (RLS). |
| **Autenticação**           | **JWT**                            | Gerenciamento de identidade, emissão e validação de tokens JWT (JSON Web Tokens), persistência segura de sessão e controle de acesso a rotas privadas.                                   |
| **Armazenamento de Mídia** | **Multer & Cloudinary**            | Processamento de uploads `multipart/form-data` no back-end e armazenamento em nuvem com geração de URLs seguras (`https`) e otimização automática de imagens.                            |
| **Hospedagem / DevOps**    | **Vercel & Render**                | Deploy contínuo e integrado: Front-end hospedado na Vercel e API REST hospedada no Render, com integração a banco de dados em nuvem.                                                     |
