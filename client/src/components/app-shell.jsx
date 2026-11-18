import { Button } from "./ui";
import { Link } from "./link";
import { ProfileMenu } from "./profile-menu";
import { useAuth } from "../hooks/useAuth";
import { Home, LayoutGrid, Plus, UserRound, LogIn, HelpCircle, Lightbulb } from "lucide-react";

import recirculaLogo from "../assets/recircula-logo.png";

const nav = [
	{ to: "/", label: "Explorar", icon: Home },
	{
		to: "/painel",
		label: "Meus anúncios",
		mobileLabel: "Painel",
		icon: LayoutGrid,
	},
	{ to: "/publicar", label: "Publicar", icon: Plus },
	{ to: "/perfil", label: "Perfil", icon: UserRound },
];

export function AppShell({ children }) {
	const { isLoggedIn } = useAuth();
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
						<Link
							to="/tutorial"
							className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:bg-accent [&.active]:text-foreground text-center"
						>
							Tutorial
						</Link>
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
							<Button size="sm" className="cursor-pointer">
								<Plus className="size-4" />
								Publicar anúncio
							</Button>
						</Link>
						{isLoggedIn && <ProfileMenu />}
					</div>

					{/* Ícone minimalista verde para celular — leva ao tutorial */}
					<div className="flex items-center md:hidden">
						<Link
							to="/tutorial"
							activeOptions={{ exact: true }}
							aria-label="Como usar o ReCircula — Tutorial"
							className="group flex size-9 items-center justify-center rounded-full text-primary transition-all duration-200 hover:bg-primary/20 active:scale-95 [&.active]:bg-primary/25 [&.active]:shadow-sm [&.active]:shadow-primary/25"
							title="Como funciona a plataforma"
						>
							<Lightbulb className="size-4.5 stroke-[2.2] text-primary transition-transform duration-200 group-hover:rotate-12" />
							<span className="sr-only">Como funciona</span>
						</Link>
					</div>
				</div>
			</header>

			<main className="pb-12 md:pb-10">{children}</main>

			<footer className="mb-20 border-t border-border bg-card/40 py-6 text-sm md:mb-0">
				<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:text-left lg:px-8">
					<div className="flex items-center gap-2 text-muted-foreground">
						<HelpCircle className="size-4 shrink-0 text-primary" />
						<span>Precisa de ajuda?</span>
						<Link
							to="/tutorial"
							className="font-medium text-primary hover:underline"
						>
							Veja o tutorial
						</Link>
					</div>
					<div className="text-xs text-muted-foreground/60">
						ReCircula &mdash; Economia circular no campus &copy;{" "}
						{new Date().getFullYear()}
					</div>
					<div className="flex items-center gap-4 text-xs text-muted-foreground">
						<Link to="/" className="transition-colors hover:text-foreground">
							Explorar
						</Link>
						<span className="text-border">•</span>
						<Link
							to="/tutorial"
							className="transition-colors hover:text-foreground"
						>
							Tutorial
						</Link>
						<span className="text-border">•</span>
						<Link
							to="/entrar"
							className="transition-colors hover:text-foreground"
						>
							Entrar
						</Link>
					</div>
				</div>
			</footer>

			<nav
				className="fixed inset-x-0 bottom-0 z-50 grid h-18 grid-cols-4 border-t border-border bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
				aria-label="Navegação móvel"
			>
				{nav.map(({ to, label, mobileLabel, icon: Icon }) => (
					<Link
						key={to}
						to={to}
						activeOptions={{ exact: to === "/" }}
						className="flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground [&.active]:text-primary"
					>
						<Icon className="size-5" />
						<span className="w-full whitespace-nowrap text-center">
							{mobileLabel ?? label}
						</span>
					</Link>
				))}
			</nav>
		</div>
	);
}
