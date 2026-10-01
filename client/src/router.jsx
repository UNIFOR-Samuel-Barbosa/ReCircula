import { lazy, Suspense, useEffect, useState } from "react";
import { AppShell } from "./components/app-shell";
import { Link, NavigationProvider } from "./lib/navigation";

const routes = [
	{
		path: "/",
		title: "Explorar — ReCircula",
		Component: lazy(() => import("./routes/marketplace/index.jsx")),
	},
	{
		path: "/entrar",
		title: "Entrar — ReCircula",
		Component: lazy(() => import("./routes/auth/entrar.jsx")),
	},
	{
		path: "/cadastro",
		title: "Criar conta — ReCircula",
		Component: lazy(() => import("./routes/auth/cadastro.jsx")),
	},
	{
		path: "/cadastro-admin",
		title: "Cadastro de administrador — ReCircula",
		Component: lazy(() => import("./routes/auth/cadastro-admin.jsx")),
	},
	{
		path: "/dashboard",
		title: "Dashboard administrativo — ReCircula",
		Component: lazy(() => import("./routes/admin/dashboard.jsx")),
	},
	{
		path: "/painel",
		title: "Meus anúncios — ReCircula",
		Component: lazy(() => import("./routes/profile/painel.jsx")),
	},
	{
		path: "/perfil",
		title: "Meu perfil — ReCircula",
		Component: lazy(() => import("./routes/profile/perfil.jsx")),
	},
	{
		path: "/usuario/:id",
		title: "Perfil do estudante — ReCircula",
		Component: lazy(() => import("./routes/profile/usuario.$id.jsx")),
	},
	{
		path: "/publicar",
		title: "Publicar anúncio — ReCircula",
		Component: lazy(() => import("./routes/marketplace/publicar.jsx")),
	},
	{
		path: "/anuncio/:id",
		title: "Detalhes do anúncio — ReCircula",
		Component: lazy(() => import("./routes/marketplace/anuncio.$id.jsx")),
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

export function AppRouter() {
	const [pathname, setPathname] = useState(window.location.pathname);
	const route = matchRoute(pathname);

	useEffect(() => {
		const syncPath = () => setPathname(window.location.pathname);
		window.addEventListener("popstate", syncPath);
		window.addEventListener("app:navigate", syncPath);
		return () => {
			window.removeEventListener("popstate", syncPath);
			window.removeEventListener("app:navigate", syncPath);
		};
	}, []);

	useEffect(() => {
		document.title = route?.title ?? "Página não encontrada — ReCircula";
	}, [route?.title]);

	const page = route ? (
		<Suspense fallback={<div className="p-10 text-center">Carregando...</div>}>
			<route.Component key={pathname} />
		</Suspense>
	) : (
		<div className="mx-auto max-w-md px-4 py-20 text-center">
			<h1 className="text-7xl font-bold text-foreground">404</h1>
			<h2 className="mt-4 text-xl font-semibold text-foreground">
				Página não encontrada
			</h2>
			<p className="mt-2 text-sm text-muted-foreground">
				O endereço acessado não corresponde a uma página do ReCircula.
			</p>
			<Link
				to="/"
				className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
			>
				Voltar ao início
			</Link>
		</div>
	);

	return (
		<NavigationProvider pathname={pathname} params={route?.params ?? {}}>
			<AppShell>{page}</AppShell>
		</NavigationProvider>
	);
}
