import { Link } from "../../components/link";
import { useState } from "react";
import { ShieldAlert, Trash2 } from "lucide-react";
import { listings as initialListings, formatPrice } from "../../lib/demo-data";
import { Button } from "../../components/ui";
import { useDemoSession } from "../../lib/demo-session";
export default function Page() {
	const { isAdmin } = useDemoSession();
	const [items, setItems] = useState(initialListings);
	const [removedUsers, setRemovedUsers] = useState([]);
	const [tab, setTab] = useState("users");
	const [target, setTarget] = useState();
	if (!isAdmin)
		return (
			<div className="mx-auto max-w-md px-4 py-20 text-center">
				<ShieldAlert className="mx-auto size-10 text-primary" />
				<h1 className="mt-4 font-display text-2xl font-bold">
					Acesso restrito
				</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Somente administradores podem ver este painel.
				</p>
				<Link to="/cadastro-admin">
					<Button className="mt-6">Cadastrar como administrador</Button>
				</Link>
			</div>
		);
	const users = Array.from(
		new Map(
			initialListings.map((l) => [
				l.sellerId,
				{ id: l.sellerId, name: l.seller, course: l.course },
			])
		).values()
	).filter((u) => !removedUsers.includes(u.id));
	const visible = items.filter((l) => !removedUsers.includes(l.sellerId));
	const confirm = () => {
		if (!target) return;
		if (target.kind === "user") setRemovedUsers([...removedUsers, target.id]);
		else setItems(items.filter((l) => l.id !== target.id));
		setTarget(undefined);
	};
	const tabClass = (t) =>
		`rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === t ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`;
	return (
		<div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
			<p className="text-sm font-semibold text-primary">Administração</p>
			<h1 className="mt-2 font-display text-3xl font-bold">Dashboard</h1>
			<div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
				<div className="rounded-lg border border-border bg-card p-4">
					<p className="text-xs text-muted-foreground">Usuários</p>
					<p className="mt-1 font-display text-2xl font-bold">{users.length}</p>
				</div>
				<div className="rounded-lg border border-border bg-card p-4">
					<p className="text-xs text-muted-foreground">Anúncios</p>
					<p className="mt-1 font-display text-2xl font-bold">
						{visible.length}
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
					Usuários
				</button>
				<button
					role="tab"
					aria-selected={tab === "listings"}
					className={tabClass("listings")}
					onClick={() => setTab("listings")}
				>
					Anúncios
				</button>
			</div>
			<div className="mt-4 grid gap-3">
				{tab === "users" &&
					users.map((u) => {
						const count = visible.filter((l) => l.sellerId === u.id).length;
						return (
							<div
								key={u.id}
								className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
							>
								<div className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold">
									{u.name
										.split(" ")
										.map((p) => p[0])
										.slice(0, 2)
										.join("")}
								</div>
								<div className="min-w-0 flex-1">
									<Link
										to="/usuario/$id"
										params={{ id: u.id }}
										className="font-semibold hover:text-primary"
									>
										{u.name}
									</Link>
									<p className="text-xs text-muted-foreground">
										{u.course} · {count} anúncio{count === 1 ? "" : "s"}
									</p>
								</div>
								<Button
									variant="ghost"
									size="icon"
									aria-label={`Excluir usuário ${u.name}`}
									onClick={() =>
										setTarget({ kind: "user", id: u.id, label: u.name })
									}
								>
									<Trash2 className="size-4" />
								</Button>
							</div>
						);
					})}
				{tab === "listings" &&
					visible.map((l) => (
						<div
							key={l.id}
							className="flex items-center gap-4 rounded-lg border border-border bg-card p-3"
						>
							<img
								src={l.image}
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
								<p className="text-sm text-primary">{formatPrice(l)}</p>
								<p className="text-xs text-muted-foreground">
									{l.seller} · {l.category}
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
								<Trash2 className="size-4" />
							</Button>
						</div>
					))}
				{((tab === "users" && users.length === 0) ||
					(tab === "listings" && visible.length === 0)) && (
					<p className="py-16 text-center text-muted-foreground">
						Nada por aqui.
					</p>
				)}
			</div>
			{target && (
				<div
					className="fixed inset-0 z-60 grid place-items-center bg-overlay px-4"
					role="dialog"
					aria-modal="true"
				>
					<div className="w-full max-w-sm rounded-lg border border-border bg-popover p-6">
						<h2 className="font-display text-xl font-bold">
							{target.kind === "user" ? "Excluir usuário?" : "Excluir anúncio?"}
						</h2>
						<p className="mt-2 text-sm leading-6 text-muted-foreground">
							{target.kind === "user"
								? `${target.label} e todos os seus anúncios serão removidos.`
								: `"${target.label}" será removido da vitrine.`}{" "}
							Essa ação não pode ser desfeita.
						</p>
						<div className="mt-6 flex justify-end gap-2">
							<Button variant="ghost" onClick={() => setTarget(undefined)}>
								Cancelar
							</Button>
							<Button variant="danger" onClick={confirm}>
								Excluir
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
