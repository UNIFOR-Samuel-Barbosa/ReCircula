import { lazy } from "react";

export const routes = [
	{
		path: "/",
		title: "Explorar — ReCircula",
		Component: lazy(() => import("../routes/marketplace/index.jsx")),
	},
	{
		path: "/entrar",
		title: "Entrar — ReCircula",
		Component: lazy(() => import("../routes/auth/entrar.jsx")),
	},
	{
		path: "/recuperar-senha",
		title: "Recuperar senha — ReCircula",
		Component: lazy(() => import("../routes/auth/recuperar-senha.jsx")),
	},
	{
		path: "/nova-senha",
		title: "Criar nova senha — ReCircula",
		Component: lazy(() => import("../routes/auth/nova-senha.jsx")),
	},
	{
		path: "/cadastro",
		title: "Criar conta — ReCircula",
		Component: lazy(() => import("../routes/auth/cadastro.jsx")),
	},
	{
		path: "/cadastro-admin",
		title: "Cadastro de administrador — ReCircula",
		Component: lazy(() => import("../routes/auth/cadastro-admin.jsx")),
	},
	{
		path: "/dashboard",
		title: "Dashboard administrativo — ReCircula",
		Component: lazy(() => import("../routes/admin/dashboard.jsx")),
	},
	{
		path: "/painel",
		title: "Meus anúncios — ReCircula",
		Component: lazy(() => import("../routes/profile/painel.jsx")),
	},
	{
		path: "/perfil",
		title: "Meu perfil — ReCircula",
		Component: lazy(() => import("../routes/profile/perfil.jsx")),
	},
	{
		path: "/usuario/:id",
		title: "Perfil do estudante — ReCircula",
		Component: lazy(() => import("../routes/profile/usuario.$id.jsx")),
	},
	{
		path: "/publicar",
		title: "Publicar anúncio — ReCircula",
		Component: lazy(() => import("../routes/marketplace/publicar.jsx")),
	},
	{
		path: "/anuncio/:id",
		title: "Detalhes do anúncio — ReCircula",
		Component: lazy(() => import("../routes/marketplace/anuncio.$id.jsx")),
	},
];

export function matchRoute(pathname) {
	const currentSegments = pathname.split("/").filter(Boolean);

	for (const route of routes) {
		const routeSegments = route.path.split("/").filter(Boolean);
		if (routeSegments.length !== currentSegments.length) continue;

		const params = {};
		const matches = routeSegments.every((segment, index) => {
			if (segment.startsWith(":")) {
				params[segment.slice(1)] = decodeURIComponent(currentSegments[index]);
				return true;
			}
			return segment === currentSegments[index];
		});

		if (matches) return { ...route, params };
	}

	return null;
}
