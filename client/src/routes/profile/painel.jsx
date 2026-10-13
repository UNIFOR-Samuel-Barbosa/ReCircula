import { Link } from "../../components/link";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Plus, Search, Trash2, Loader2, Sparkles } from "lucide-react";
import { formatPrice } from "../../lib/demo-data";
import { Button, Input } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { announceApi } from "../../services/api";
import { useNavigate } from "../../hooks/useNavigation";
import { showToast } from "../../services/toast";

export default function Page() {
	const nav = useNavigate();
	const { isLoggedIn, isLoading } = useAuth();
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [target, setTarget] = useState();
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		if (!isLoading && !isLoggedIn) {
			nav({ to: "/entrar" });
		}
	}, [isLoading, isLoggedIn, nav]);

	const loadAnnounces = useCallback(async () => {
		if (!isLoggedIn) return;
		setLoading(true);
		try {
			const res = await announceApi.getMine();
			setItems(res || []);
		} catch (err) {
			console.warn("Erro ao buscar anúncios:", err);
		} finally {
			setLoading(false);
		}
	}, [isLoggedIn]);

	useEffect(() => {
		if (isLoggedIn) {
			loadAnnounces();
		}
	}, [isLoggedIn, loadAnnounces]);

	const shown = useMemo(
		() =>
			items.filter((x) => x.title.toLowerCase().includes(query.toLowerCase())),
		[items, query]
	);

	const handleDelete = async () => {
		if (!target) return;
		setDeleting(true);
		try {
			await announceApi.delete(target);
			setItems((prev) => prev.filter((x) => x.id !== target));
			showToast({ text: "Anúncio excluído com sucesso.", color: "green" });
		} catch (err) {
			showToast({
				text: err.message || "Erro ao excluir anúncio.",
				color: "red",
			});
		} finally {
			setDeleting(false);
			setTarget(undefined);
		}
	};

	if (isLoading) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center p-10">
				<Loader2 className="size-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="text-sm font-semibold text-primary">Seu espaço</p>
					<h1 className="mt-2 font-display text-3xl font-bold">
						Meus anúncios
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						{items.length} anúncio{items.length === 1 ? "" : "s"} ativo
						{items.length === 1 ? "" : "s"}
					</p>
				</div>
				<Link to="/publicar">
					<Button>
						<Plus className="size-4" />
						Novo anúncio
					</Button>
				</Link>
			</div>

			<div className="relative mt-8 max-w-md">
				<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Buscar nos meus anúncios"
					className="pl-9"
				/>
			</div>

			{loading ? (
				<div className="py-20 text-center text-muted-foreground">
					<Loader2 className="mx-auto size-8 animate-spin text-primary" />
					<p className="mt-2 text-sm">Carregando seus anúncios...</p>
				</div>
			) : (
				<div className="mt-6 grid gap-3">
					{shown.map((item) => (
						<div
							key={item.id}
							className="flex items-center gap-4 rounded-lg border border-border bg-card p-3 shadow-sm"
						>
							<img
								src={item.image_url || item.image}
								alt=""
								width={120}
								height={90}
								className="h-20 w-24 rounded-md object-cover"
							/>
							<div className="min-w-0 flex-1">
								<Link
									to="/anuncio/$id"
									params={{ id: item.id }}
									className="font-semibold hover:text-primary"
								>
									{item.title}
								</Link>
								<p className="mt-1 text-sm text-primary">{formatPrice(item)}</p>
								<p className="mt-1 text-xs text-muted-foreground">
									{item.category}
								</p>
							</div>
							<div className="flex gap-1">
								<Button
									variant="ghost"
									size="icon"
									aria-label="Excluir anúncio"
									onClick={() => setTarget(item.id)}
								>
									<Trash2 className="size-4 text-destructive" />
								</Button>
							</div>
						</div>
					))}
					{shown.length === 0 && (
						<div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
							<Sparkles className="mx-auto size-8 text-primary" />
							<p className="mt-2 font-semibold">Nenhum anúncio encontrado.</p>
							<p className="mt-1 text-xs">
								Publique materiais que você não usa mais para que outros
								estudantes possam aproveitar.
							</p>
							<Link to="/publicar" className="mt-4 inline-block">
								<Button size="sm">Publicar agora</Button>
							</Link>
						</div>
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
						<h2 className="font-display text-xl font-bold">Excluir anúncio?</h2>
						<p className="mt-2 text-sm leading-6 text-muted-foreground">
							Essa ação remove o anúncio da plataforma e não pode ser desfeita.
						</p>
						<div className="mt-6 flex justify-end gap-2">
							<Button
								variant="ghost"
								onClick={() => setTarget(undefined)}
								disabled={deleting}
							>
								Cancelar
							</Button>
							<Button
								variant="danger"
								onClick={handleDelete}
								disabled={deleting}
							>
								{deleting ? "Excluindo..." : "Excluir"}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
