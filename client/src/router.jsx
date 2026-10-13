import { Suspense, useEffect, useState } from "react";
import { AppShell } from "./components/app-shell";
import { Link } from "./components/link";
import { NavigationProvider } from "./context/NavigationContext";
import { AuthProvider } from "./context/AuthContext";
import { matchRoute } from "./lib/routes";
import { ToastProvider } from "./service/toast";

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
		<AuthProvider>
			<NavigationProvider pathname={pathname} params={route?.params ?? {}}>
				<AppShell>{page}</AppShell>
				<ToastProvider />
			</NavigationProvider>
		</AuthProvider>
	);
}
