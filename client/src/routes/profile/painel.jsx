import { Link } from "../../components/link";
import { useMemo, useState } from "react";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import { listings, currentUser, formatPrice } from "../../lib/demo-data";
import { Button, Input } from "../../components/ui";
export default function Page() {
	const initial = listings.filter((x) => x.sellerId === currentUser.id);
	const [items, setItems] = useState(initial);
	const [query, setQuery] = useState("");
	const [target, setTarget] = useState();
	const shown = useMemo(
		() =>
			items.filter((x) => x.title.toLowerCase().includes(query.toLowerCase())),
		[items, query]
	);
	return (
		<div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="text-sm font-semibold text-primary">Seu espaço</p>
					<h1 className="mt-2 font-display text-3xl font-bold">
						Meus anúncios
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						{items.length} anúncios ativos
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
			<div className="mt-6 grid gap-3">
				{shown.map((item) => (
					<div
						key={item.id}
						className="flex items-center gap-4 rounded-lg border border-border bg-card p-3"
					>
						<img
							src={item.image}
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
								{item.category} · {item.time}
							</p>
						</div>
						<div className="flex gap-1">
							<Button variant="ghost" size="icon" aria-label="Editar anúncio">
								<Edit3 className="size-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								aria-label="Excluir anúncio"
								onClick={() => setTarget(item.id)}
							>
								<Trash2 className="size-4" />
							</Button>
						</div>
					</div>
				))}
				{shown.length === 0 && (
					<p className="py-16 text-center text-muted-foreground">
						Nenhum anúncio encontrado.
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
						<h2 className="font-display text-xl font-bold">Excluir anúncio?</h2>
						<p className="mt-2 text-sm leading-6 text-muted-foreground">
							Essa ação remove o anúncio da vitrine e não pode ser desfeita.
						</p>
						<div className="mt-6 flex justify-end gap-2">
							<Button variant="ghost" onClick={() => setTarget(undefined)}>
								Cancelar
							</Button>
							<Button
								variant="danger"
								onClick={() => {
									setItems(items.filter((x) => x.id !== target));
									setTarget(undefined);
								}}
							>
								Excluir
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
