# ReCircula API

API REST responsável pelo gerenciamento de anúncios, perfis e upload de imagens do ReCircula.

Base URL (desenvolvimento):

http://localhost:3001

---

# Autenticação

A API gera e valida os próprios tokens (JWT + bcrypt). O Supabase é usado apenas como banco de dados.

- **Access token** (JWT, 15 min): enviar em todas as rotas protegidas.
- **Refresh token** (opaco, 7 dias): usado apenas em `/auth/refresh` e `/auth/logout`. A cada renovação, o token antigo é invalidado e um novo par é devolvido; guarde sempre o último.

Header das rotas protegidas:

Authorization: Bearer <accessToken>

Quando uma rota protegida responder `401`, o frontend deve chamar `/auth/refresh` uma vez e repetir a requisição. Se a renovação também falhar, redirecionar para o login. Evite disparar várias renovações em paralelo: reutilizar um refresh token já trocado encerra todas as sessões do usuário.

## Rotas de autenticação

| Método | Rota | Body | Resposta |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | `{ name, email, password }` | `201` sessão |
| `POST` | `/auth/register-admin` | `{ name, email, password, accessCode }` | `201` sessão (`role: "admin"`) |
| `POST` | `/auth/login` | `{ email, password }` | `200` sessão |
| `POST` | `/auth/refresh` | `{ refreshToken }` | `200` sessão (novo par de tokens) |
| `POST` | `/auth/logout` | `{ refreshToken }` | `204` |
| `POST` | `/auth/forgot-password` | `{ email }` | `200` `{ message }` (mesma resposta exista ou não o e-mail) |
| `POST` | `/auth/reset-password` | `{ token, password }` | `204` |

Senha: 8 a 72 caracteres. O link de recuperação aponta para `${FRONTEND_URL}/redefinir-senha?token=...` e expira em 30 minutos; após a redefinição, todas as sessões do usuário são encerradas.

Sessão:

```json
{
	"user": {
		"id": "...",
		"email": "ana@example.com",
		"role": "user",
		"name": "Ana",
		"photo_url": null,
		"biography": null,
		"telephone": null,
		"created_at": "2026-10-08T18:00:00Z"
	},
	"accessToken": "eyJhbGciOiJIUzI1NiIs...",
	"refreshToken": "q3Jx..."
}
```

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
- JWT + bcrypt
- Resend
- Supabase
- PostgreSQL
- Zod
- Multer
- Cloudinary
