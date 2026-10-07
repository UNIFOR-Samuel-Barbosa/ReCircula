# ReCircula API

API REST responsável pelo gerenciamento de anúncios, perfis e upload de imagens do ReCircula.

Base URL (desenvolvimento):

http://localhost:3001

---

# Autenticação

As rotas protegidas utilizam o Access Token do Supabase.

Enviar no header:

Authorization: Bearer <access_token>

Exemplo:

Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

---

# Endpoints

## Listar anúncios

GET /announces

### Query Params (opcionais)

| Parâmetro | Tipo                                        | Exemplo |
| --------- | ------------------------------------------- | ------- |
| category  | string                                      | Livros  |
| search    | string                                      | Cálculo |
| donation  | boolean                                     | true    |
| user_id   | uuid                                        | ...     |
| sort      | recent \| oldest \| price-asc \| price-desc | recent  |

Exemplo:

GET /announces?category=Livros&donation=true

Resposta:

```json
[
	{
		"id": "...",
		"user_id": "...",
		"image_url": "...",
		"title": "Livro de Cálculo",
		"description": "Pouco usado",
		"category": "Livros",
		"price": 40,
		"donation": false,
		"created_at": "2026-07-20T18:00:00Z"
	}
]
```

---

## Buscar anúncio

GET /announces/:id

---

## Criar anúncio

POST /announces

Header:

Authorization: Bearer TOKEN

Body:

```json
{
	"image_url": "...",
	"title": "...",
	"description": "...",
	"category": "...",
	"price": 50,
	"donation": false
}
```

---

## Atualizar anúncio

PATCH /announces/:id

---

## Excluir anúncio

DELETE /announces/:id

---

## Meu perfil

GET /profiles

---

## Atualizar perfil

PATCH /profiles

Body:

```json
{
	"name": "...",
	"photo_url": "...",
	"biography": "...",
	"telephone": "85999999999"
}
```

---

## Upload de imagem

POST /upload

Content-Type:

multipart/form-data

Campo:

image

Exemplo de Resposta:

```json
{
  "public_id": "c87hg9xfxrd4itiim3t0",
  "version": 1571218607,
  "width": 864,
  "height": 576,
  "format": "jpg",
  "resource_type": "image",
  "url": "http://res.cloudinary.com/demo/image/upload/v1571218607/c87hg9xfxrd4itiim3t0.jpg",
  "secure_url": "https://res.cloudinary.com/demo/image/upload/v1571218607/c87hg9xfxrd4itiim3t0.jpg"
}
```

---

# Status HTTP

| Código | Significado     |
| ------ | --------------- |
| 200    | OK              |
| 201    | Criado          |
| 204    | Sem conteúdo    |
| 400    | Dados inválidos |
| 401    | Não autenticado |
| 403    | Sem permissão   |
| 404    | Não encontrado  |
| 500    | Erro interno    |

---

# Tecnologias

- Express
- TypeScript
- Supabase
- PostgreSQL
- Zod
- Multer
- Cloudinary
