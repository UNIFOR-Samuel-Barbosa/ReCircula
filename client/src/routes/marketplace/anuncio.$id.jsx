import { useEffect, useState } from "react";
import { Link } from "../../components/link";
import { useParams } from "../../hooks/useNavigation";
import { ArrowLeft, MessageCircle, MapPin, ShieldCheck, Loader2 } from "lucide-react";
import { listings, formatPrice } from "../../lib/demo-data";
import { Button } from "../../components/ui";
import { announceApi } from "../../services/api";

export default function Page() {
	const { id } = useParams();
	const [item, setItem] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		announceApi
			.getById(id)
			.then((apiItem) => {
				if (apiItem) {
					setItem({
						id: apiItem.id,
						title: apiItem.title,
						category: apiItem.category,
						price: apiItem.price,
						donation: apiItem.donation,
						image: apiItem.image_url,
						seller: apiItem.user?.name || "Estudante",
						sellerId: apiItem.user_id,
						course: apiItem.user?.telephone || "Estudante UNIFOR",
						phone: apiItem.user?.telephone,
						description: apiItem.description || "Sem descrição informada.",
					});
				} else {
					const fallback = listings.find((x) => x.id === id) ?? listings.at(0);
					setItem(fallback);
				}
			})
			.catch(() => {
				const fallback = listings.find((x) => x.id === id) ?? listings.at(0);
				setItem(fallback);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [id]);

	if (loading) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center p-10">
				<Loader2 className="size-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!item) {
		return <div className="p-10 text-center">Anúncio indisponível.</div>;
	}

	const rawPhone = item.phone || "5585999991204";
	const cleanPhone = rawPhone.replace(/\D/g, "");

	return (
		<div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
			<Link
				to="/"
				className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
			>
				<ArrowLeft className="size-4" />
				Voltar aos anúncios
			</Link>
			<div className="grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
				<div className="overflow-hidden rounded-lg border border-border bg-card">
					<img
						src={item.image}
						alt={item.title}
						width={960}
						height={720}
						className="aspect-4/3 h-full w-full object-cover"
					/>
				</div>
				<div className="flex flex-col">
					<span className="text-sm font-semibold text-primary">
						{item.category}
					</span>
					<h1 className="mt-2 font-display text-3xl font-bold lg:text-4xl">
						{item.title}
					</h1>
					<p className="mt-4 text-3xl font-bold text-primary">
						{formatPrice(item)}
					</p>
					<p className="mt-6 leading-7 text-muted-foreground">
						{item.description}
					</p>
					<div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
						<MapPin className="size-4" />
						Entrega combinada no campus
					</div>
					<div className="mt-8 border-y border-border py-5">
						<Link
							to="/usuario/$id"
							params={{ id: item.sellerId }}
							className="flex items-center gap-3"
						>
							<span className="grid size-11 place-items-center rounded-full bg-secondary font-bold">
								{item.seller
									.split(" ")
									.map((x) => x[0])
									.slice(0, 2)
									.join("")}
							</span>
							<span>
								<strong className="block">{item.seller}</strong>
								<small className="text-muted-foreground">{item.course}</small>
							</span>
							<span className="ml-auto text-sm text-primary">Ver perfil</span>
						</Link>
					</div>
					<a
						className="mt-6"
						href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
							`Olá! Vi o anúncio “${item.title}” no ReCircula.`
						)}`}
						target="_blank"
						rel="noreferrer"
					>
						<Button className="w-full">
							<MessageCircle className="size-5" />
							Conversar no WhatsApp
						</Button>
					</a>
					<p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
						<ShieldCheck className="size-4" />
						Combine a entrega em um local movimentado do campus.
					</p>
				</div>
			</div>
		</div>
	);
}
