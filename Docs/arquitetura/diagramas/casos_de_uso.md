# Diagramas de Caso de Uso - ReCircula

Abaixo estão os diagramas de caso de uso do sistema **ReCircula**, modelados com base nos requisitos funcionais e atores definidos. A notação utilizada foi o formato de fluxograma (_flowchart_) do Mermaid.js, amplamente suportado nativamente pelo GitHub e outras ferramentas de Markdown.

## 1. Visão Geral (Atores Principais)

Este diagrama exibe a visão macro do sistema, destacando as interações primárias entre os visitantes, estudantes autenticados e o serviço externo de imagens.

```mermaid
flowchart LR
    %% Atores
    Visitante(["👤 Visitante (Não Autenticado)"])
    Estudante(["🎓 Estudante (Autenticado)"])
    Cloudinary(["☁️ Cloudinary (Serviço Externo)"])

    %% Sistema
    subgraph ReCircula [Sistema ReCircula]
        direction TB

        %% Subsistema de Autenticação
        UC1(Cadastrar Conta)
        UC2(Fazer Login)
        UC3(Recuperar Senha)

        %% Subsistema de Marketplace
        UC4(Visualizar Vitrine Pública)
        UC5(Buscar e Filtrar Anúncios)

        %% Subsistema do Usuário
        UC6(Publicar Anúncio)
        UC7(Gerenciar Meus Anúncios)
        UC8(Visualizar/Editar Meu Perfil)
        UC9(Ver Perfil de Outro Usuário)
        UC10(Contatar via WhatsApp)

        %% Funcionalidades Internas
        UC11(Upload de Imagem)
    end

    %% Relacionamentos Visitante
    Visitante --> UC1
    Visitante --> UC2
    Visitante --> UC3
    Visitante --> UC4
    Visitante --> UC5

    %% Relacionamentos Estudante
    Estudante -->|Herda permissões de Visitante| UC4
    Estudante --> UC6
    Estudante --> UC7
    Estudante --> UC8
    Estudante --> UC9
    Estudante --> UC10

    %% Includes / Relações Internas
    UC6 -. "<<include>>" .-> UC11
    UC8 -. "<<include>>" .-> UC11

    %% Sistemas Externos
    UC11 --> Cloudinary
```

---

## 2. Subsistema de Autenticação e Perfil

Focado exclusivamente nas operações de gestão de acesso à plataforma e edição das informações públicas do estudante.

```mermaid
flowchart LR
    Visitante(["👤 Visitante"])
    Estudante(["🎓 Estudante"])
    Cloudinary(["☁️ Cloudinary"])

    subgraph "Gestão de Acesso e Perfil"
        direction TB
        UC1(Criar Conta)
        UC2(Fazer Login)
        UC3(Solicitar Recuperação de Senha)
        UC4(Redefinir Senha)
        UC5(Fazer Logout)
        UC6(Visualizar Meu Perfil)
        UC7(Editar Meu Perfil)
        UC8(Fazer Upload de Foto)
    end

    Visitante --> UC1
    Visitante --> UC2
    Visitante --> UC3
    Visitante --> UC4

    Estudante --> UC5
    Estudante --> UC6
    Estudante --> UC7

    UC7 -. "<<include>>" .-> UC8
    UC8 --> Cloudinary
```

---

## 3. Subsistema de Marketplace e Anúncios

Focado na essência da economia circular do projeto, detalhando a listagem, criação e interação com os anúncios da plataforma.

```mermaid
flowchart LR
    Visitante(["👤 Visitante"])
    Estudante(["🎓 Estudante"])
    Cloudinary(["☁️ Cloudinary"])

    subgraph "Marketplace (Desapego e Doações)"
        direction TB
        UC1(Visualizar Vitrine de Anúncios)
        UC2(Filtrar por Categoria / Doação)
        UC3(Buscar Anúncios por Texto)
        UC4(Publicar Novo Anúncio)
        UC5(Upload de Imagem do Anúncio)
        UC6(Excluir Próprio Anúncio)
        UC7(Acessar Dashboard de Anúncios)
        UC8(Visualizar Perfil do Anunciante)
        UC9(Acionar Contato no WhatsApp)
    end

    Visitante --> UC1
    Visitante --> UC2
    Visitante --> UC3

    Estudante --> UC1
    Estudante --> UC2
    Estudante --> UC3
    Estudante --> UC4
    Estudante --> UC6
    Estudante --> UC7
    Estudante --> UC8
    Estudante --> UC9

    UC4 -. "<<include>>" .-> UC5
    UC5 --> Cloudinary
    UC9 -. "<<extend>>" .-> UC8
```
