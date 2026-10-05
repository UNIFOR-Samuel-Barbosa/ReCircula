import { useParams } from "../../hooks/useNavigation";
import { MessageCircle, MapPin } from "lucide-react";
import { listings } from "../../lib/demo-data";
import { ListingCard } from "../../components/listing-card";
import { Button } from "../../components/ui";
export default function Page() {
	const { id } = useParams();
	const items = listings.filter((x) => x.sellerId === id);
	const sample = items.at(0) ?? listings.at(0);
	if (!sample)
		return <div className="p-10 text-center">Perfil indisponível.</div>;
	return (
		<div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
			<div className="flex flex-col items-start gap-6 border-b border-border pb-8 sm:flex-row sm:items-center">
				<span className="grid size-24 place-items-center rounded-full bg-secondary font-display text-2xl font-bold">
					{sample.seller
						.split(" ")
						.map((x) => x[0])
						.slice(0, 2)
						.join("")}
				</span>
				<div className="flex-1">
					<h1 className="font-display text-3xl font-bold">{sample.seller}</h1>
					<p className="mt-1 text-sm text-muted-foreground">{sample.course}</p>
					<p className="mt-4 max-w-xl text-muted-foreground">
						Materiais bem cuidados, negociação transparente e entrega dentro do
						campus.
					</p>
					<p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
						<MapPin className="size-4" />
						Fortaleza · Campus UNIFOR
					</p>
				</div>
				<a
					href={`https://wa.me/5585999991204?text=${encodeURIComponent("Olá! Encontrei seu perfil no ReCircula.")}`}
					target="_blank"
					rel="noreferrer"
				>
					<Button>
						<MessageCircle className="size-4" />
						Conversar
					</Button>
				</a>
			</div>
			<h2 className="mt-9 font-display text-xl font-semibold">
				Anúncios de {sample.seller.split(" ")[0]}
			</h2>
			<div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{items.map((x) => (
					<ListingCard key={x.id} item={x} />
				))}
			</div>
		</div>
	);
}
