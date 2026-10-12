-- Usuário de demonstração (login: demo@recircula.com / senha: recircula123).
-- A senha é gravada com bcrypt pelo pgcrypto, no mesmo formato usado pela API.

insert into profiles
(
id,
email,
password_hash,
name,
biography
)

values

(
'00000000-0000-4000-8000-000000000001',

'demo@recircula.com',

crypt('recircula123', gen_salt('bf', 10)),

'Usuário Demo',

'Conta de demonstração do ReCircula.'
);

-- =======================

insert into announces
(
id,
user_id,
title,
category,
image_url,
price,
donation
)

values

(
gen_random_uuid(),

'00000000-0000-4000-8000-000000000001',

'Livro de Algoritmos',

'Livros',

'https://i.ibb.co/...',

45,

false
);

-- =======================

insert into announces
(
id,
user_id,
title,
category,
image_url,
price,
donation
)

values

(
gen_random_uuid(),

'00000000-0000-4000-8000-000000000001',

'Calculadora Casio',

'Eletrônicos',

'https://i.ibb.co/...',

20,

false
);

-- =======================

insert into announces
(
id,
user_id,
title,
category,
image_url,
price,
donation
)

values

(
gen_random_uuid(),

'00000000-0000-4000-8000-000000000001',

'Jaleco do Tony Stark',

'Jaleco',

'https://i.ibb.co/...',

65,

false
);

-- =======================

insert into announces
(
id,
user_id,
title,
category,
image_url,
price,
donation
)

values

(
gen_random_uuid(),

'00000000-0000-4000-8000-000000000001',

'Monitor LG',

'Eletrônicos',

'https://i.ibb.co/...',

400,

false
);

-- =======================

insert into announces
(
id,
user_id,
title,
category,
image_url,
price,
donation
)

values

(
gen_random_uuid(),

'00000000-0000-4000-8000-000000000001',

'Livro Code Clean',

'Livros',

'https://i.ibb.co/...',

false,

true
);

-- =======================

insert into announces
(
id,
user_id,
title,
category,
image_url,
price,
donation
)

values

(
gen_random_uuid(),

'00000000-0000-4000-8000-000000000001',

'Livro Crepúsculo: Vol. 1',

'Livros',

'https://i.ibb.co/...',

100,

false
);

-- =======================

insert into announces
(
id,
user_id,
title,
category,
image_url,
price,
donation
)

values

(
gen_random_uuid(),

'00000000-0000-4000-8000-000000000001',

'Livro Crepúsculo: Vol. 2',

'Livros',

'https://i.ibb.co/...',

120,

false
);

-- =======================

insert into announces
(
id,
user_id,
title,
category,
image_url,
price,
donation
)

values

(
gen_random_uuid(),

'00000000-0000-4000-8000-000000000001',

'Livro Crepúsculo: Vol. 3',

'Livros',

'https://i.ibb.co/...',

130,

false
);

-- =======================

insert into announces
(
id,
user_id,
title,
category,
image_url,
price,
donation
)

values

(
gen_random_uuid(),

'00000000-0000-4000-8000-000000000001',

'Livro Crepúsculo: Vol. 4',

'Livros',

'https://i.ibb.co/...',

150,

false
);

-- =======================

insert into announces
(
id,
user_id,
title,
category,
image_url,
price,
donation
)

values

(
gen_random_uuid(),

'00000000-0000-4000-8000-000000000001',

'Livro Crepúsculo: Vol. 5',

'Livros',

'https://i.ibb.co/...',

170,

false
);

-- =======================