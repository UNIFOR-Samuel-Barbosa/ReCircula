import { Link } from "./link";
import { Home, LayoutGrid, Plus, UserRound, LogIn } from "lucide-react";
import { Button } from "./ui";
import { useDemoSession } from "../lib/demo-session";
import { ProfileMenu } from "./profile-menu";
import recirculaLogo from "../assets/recircula-logo.png";

const nav = [
	{ to: "/", label: "Explorar", icon: Home },
	{ to: "/painel", label: "Meus anúncios", icon: LayoutGrid },
	{ to: "/publicar", label: "Publicar", icon: Plus },
	{ to: "/perfil", label: "Perfil", icon: UserRound },
];

export function AppShell({ children }) {
	const { isLoggedIn } = useDemoSession();
	return (
		<div className="min-h-screen bg-background text-foreground">
			<header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
					<Link
						to="/"
						className="flex items-center gap-2 font-display text-lg font-bold"
						aria-label="ReCircula — página inicial"
					>
						<img
							src={recirculaLogo}
							alt=""
							width={32}
							height={32}
							className="size-8 object-contain"
						/>
						ReCircula
					</Link>
					<nav
						className="hidden items-center gap-1 md:flex"
						aria-label="Navegação principal"
					>
						{nav.slice(0, 2).map(({ to, label }) => (
							<Link
								key={to}
								to={to}
								activeOptions={{ exact: to === "/" }}
								className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:bg-accent [&.active]:text-foreground text-center"
							>
								{label}
							</Link>
						))}
					</nav>
					<div className="hidden items-center gap-2 md:flex">
						{!isLoggedIn && (
							<Link to="/entrar">
								<Button variant="ghost" size="sm">
									<LogIn className="size-4" />
									Entrar
								</Button>
							</Link>
						)}
						<Link to="/publicar">
							<Button size="sm">
								<Plus className="size-4" />
								Publicar anúncio
							</Button>
						</Link>
						{isLoggedIn && <ProfileMenu />}
					</div>
				</div>
			</header>
			<main className="pb-24 md:pb-10">{children}</main>
			<nav
				className="fixed inset-x-0 bottom-0 z-50 grid h-18 grid-cols-4 border-t border-border bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
				aria-label="Navegação móvel"
			>
				{nav.map(({ to, label, icon: Icon }) => (
					<Link
						key={to}
						to={to}
						activeOptions={{ exact: to === "/" }}
						className="flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground [&.active]:text-primary"
					>
						<Icon className="size-5" />
						{label}
					</Link>
				))}
			</nav>
		</div>
	);
}
