import { useCallback, useEffect, useState } from "react";
import { ShieldAlert, Trash2, Loader2 } from "lucide-react";

import { Button } from "../../components/ui";
import { Link } from "../../components/link";

import { useAuth } from "../../hooks/useAuth";

import { formatPrice } from "@/lib/formatters";
import { profileApi, announceApi } from "../../services/api";
import {
	buildCacheKey,
	readCacheEntry,
	writeCacheEntry,
} from "../../services/cache";
import { showToast } from "../../services/toast";

export default function Page() {
	const { isAdmin, isLoggedIn, isLoading, user } = useAuth();
	const [users, setUsers] = useState([]);
	const [listings, setListings] = useState([]);
	const [loadingData, setLoadingData] = useState(true);
	const [tab, setTab] = useState("users");
	const [target, setTarget] = useState();
	const [actionLoading, setActionLoading] = useState(false);

	const loadData = useCallback(async () => {
		const cacheKey = buildCacheKey("admin:dashboard", {
			userId: user?.id || "anonymous",
		});
		const cachedDashboard = readCacheEntry(cacheKey);
		if (cachedDashboard) {
			setUsers((cachedDashboard.users || []).filter((u) => u.id !== user?.id));
			setListings(cachedDashboard.listings || []);
			setLoadingData(false);
		}

		setLoadingData(true);
		try {
			const [fetchedUsers, fetchedListings] = await Promise.all([
				profileApi.getAll().catch(() => []),
				announceApi.getAll().catch(() => []),
			]);
			const nextUsers = (fetchedUsers || []).filter((u) => u.id !== user?.id);
			const nextListings = fetchedListings || [];
			const nextValue = { users: nextUsers, listings: nextListings };
			writeCacheEntry(cacheKey, nextValue);
			setUsers(nextUsers);
			setListings(nextListings);
		} catch (err) {
			console.warn("Erro ao carregar dados do dashboard:", err);
			if (!cachedDashboard) {
				setUsers([]);
				setListings([]);
			}
		} finally {
			setLoadingData(false);
		}
	}, [user?.id]);

	useEffect(() => {
		if (isAdmin) {
			loadData();
		}
	}, [isAdmin, loadData]);

	if (isLoading) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center p-10">
				<Loader2 className="size-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!isAdmin) {
		return (
			<div className="mx-auto max-w-md px-4 py-20 text-center">
				<ShieldAlert className="mx-auto size-10 text-primary" />
				<h1 className="mt-4 font-display text-2xl font-bold">
					Acesso restrito
				</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Somente administradores podem ver este painel.
				</p>
				{!isLoggedIn ? (
					<Link to="/entrar">
						<Button className="mt-6">Fazer login</Button>
					</Link>
				) : (
					<Link to="/">
						<Button className="mt-6">Voltar ao início</Button>
					</Link>
				)}
			</div>
		);
	}

	const confirm = async () => {
		if (!target) return;
		setActionLoading(true);

		try {
			if (target.kind === "user") {
				await profileApi.deleteUser(target.id);
				setUsers((prev) => prev.filter((u) => u.id !== target.id));
				setListings((prev) => prev.filter((l) => l.user_id !== target.id));
				showToast({ text: "Usuário excluído com sucesso.", color: "green" });
			} else {
				await announceApi.delete(target.id);
				setListings((prev) => prev.filter((l) => l.id !== target.id));
				showToast({ text: "Anúncio excluído com sucesso.", color: "green" });
			}
		} catch (err) {
			showToast({
				text: err.message || "Erro ao realizar exclusão.",
				color: "red",
			});
		} finally {
			setActionLoading(false);
			setTarget(undefined);
		}
	};

	const tabClass = (t) =>
		`rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
			tab === t
				? "bg-accent text-foreground"
				: "text-muted-foreground hover:text-foreground"
		}`;

	return (
		<div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
			<p className="text-sm font-semibold text-primary">Administração</p>
			<h1 className="mt-2 font-display text-3xl font-bold">Dashboard</h1>

			<div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
				<div className="rounded-lg border border-border bg-card p-4">
					<p className="text-xs text-muted-foreground">Usuários cadastrados</p>
					<p className="mt-1 font-display text-2xl font-bold">{users.length}</p>
				</div>
				<div className="rounded-lg border border-border bg-card p-4">
					<p className="text-xs text-muted-foreground">Anúncios no ar</p>
					<p className="mt-1 font-display text-2xl font-bold">
						{listings.length}
					</p>
				</div>
			</div>

			<div className="mt-8 flex gap-1" role="tablist">
				<button
					role="tab"
					aria-selected={tab === "users"}
					className={tabClass("users")}
					onClick={() => setTab("users")}
				>
					Usuários ({users.length})
				</button>
				<button
					role="tab"
					aria-selected={tab === "listings"}
					className={tabClass("listings")}
					onClick={() => setTab("listings")}
				>
					Anúncios ({listings.length})
				</button>
			</div>

			{loadingData ? (
				<div className="py-20 text-center text-muted-foreground">
					<Loader2 className="mx-auto size-8 animate-spin text-primary" />
					<p className="mt-2 text-sm">Carregando dados da plataforma...</p>
				</div>
			) : (
				<div className="mt-4 grid gap-3">
					{tab === "users" &&
						users.map((u) => {
							const count = listings.filter((l) => l.user_id === u.id).length;
							const initials = (u.name || "U")
								.trim()
								.split(/\s+/)
								.map((p) => p[0])
								.slice(0, 2)
								.join("")
								.toUpperCase();

							return (
								<div
									key={u.id}
									className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-sm"
								>
									<div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-secondary text-sm font-bold">
										{u.photo_url ? (
											<img
												src={u.photo_url}
												alt={u.name || "Foto do usuário"}
												className="size-full object-cover"
											/>
										) : (
											initials
										)}
									</div>
									<div className="min-w-0 flex-1">
										<div className="flex items-center gap-2">
											<span className="font-semibold">{u.name}</span>
											{u.role === "admin" && (
												<span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
													Admin
												</span>
											)}
										</div>
										<p className="text-xs text-muted-foreground">
											{u.email} · {count} anúncio{count === 1 ? "" : "s"}
										</p>
									</div>
									<div className="flex items-center gap-2">
										<Link to="/usuario/$id" params={{ id: u.id }}>
											<Button size="sm" variant="secondary">
												Ver Perfil
											</Button>
										</Link>
										<Button
											variant="ghost"
											size="icon"
											aria-label={`Excluir usuário ${u.name}`}
											onClick={() =>
												setTarget({ kind: "user", id: u.id, label: u.name })
											}
										>
											<Trash2 className="size-4 text-destructive" />
										</Button>
									</div>
								</div>
							);
						})}

					{tab === "listings" &&
						listings.map((l) => (
							<div
								key={l.id}
								className="flex items-center gap-4 rounded-lg border border-border bg-card p-3 shadow-sm"
							>
								<img
									src={l.image_url || l.image}
									alt=""
									width={96}
									height={72}
									className="h-16 w-20 rounded-md object-cover"
								/>
								<div className="min-w-0 flex-1">
									<Link
										to="/anuncio/$id"
										params={{ id: l.id }}
										className="font-semibold hover:text-primary"
									>
										{l.title}
									</Link>
									<p className="mt-1 text-sm text-primary">{formatPrice(l)}</p>
									<p className="text-xs text-muted-foreground">
										{l.user?.name || "Vendedor"} · {l.category}
									</p>
								</div>
								<Button
									variant="ghost"
									size="icon"
									aria-label={`Excluir anúncio ${l.title}`}
									onClick={() =>
										setTarget({ kind: "listing", id: l.id, label: l.title })
									}
								>
									<Trash2 className="size-4 text-destructive" />
								</Button>
							</div>
						))}

					{((tab === "users" && users.length === 0) ||
						(tab === "listings" && listings.length === 0)) && (
						<p className="py-16 text-center text-muted-foreground">
							Nada por aqui.
						</p>
					)}
				</div>
			)}

			{target && (
				<div
					className="fixed inset-0 z-60 grid place-items-center bg-overlay px-4"
					role="dialog"
					aria-modal="true"
				>
					<div className="w-full max-w-sm rounded-lg border border-border bg-popover p-6 shadow-2xl">
						<h2 className="font-display text-xl font-bold">
							{target.kind === "user" ? "Excluir usuário?" : "Excluir anúncio?"}
						</h2>
						<p className="mt-2 text-sm leading-6 text-muted-foreground">
							{target.kind === "user"
								? `${target.label} e todos os seus anúncios serão removidos.`
								: `"${target.label}" será removido da plataforma.`}{" "}
							Essa ação não pode ser desfeita.
						</p>
						<div className="mt-6 flex justify-end gap-2">
							<Button
								variant="ghost"
								onClick={() => setTarget(undefined)}
								disabled={actionLoading}
							>
								Cancelar
							</Button>
							<Button
								variant="danger"
								onClick={confirm}
								disabled={actionLoading}
							>
								{actionLoading ? "Excluindo..." : "Excluir"}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
