import { useEffect, useState } from "react";
import { useParams } from "../../hooks/useNavigation";
import { MessageCircle, MapPin, Loader2 } from "lucide-react";
import { listings } from "../../lib/demo-data";
import { ListingCard } from "../../components/listing-card";
import { Button } from "../../components/ui";
import { profileApi, announceApi } from "../../services/api";

export default function Page() {
	const { id } = useParams();
	const [profile, setProfile] = useState(null);
	const [userItems, setUserItems] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		Promise.all([
			profileApi.getById(id).catch(() => null),
			announceApi.getByUserId(id).catch(() => []),
		])
			.then(([apiProfile, apiItems]) => {
				if (apiProfile) {
					setProfile(apiProfile);
					setUserItems(apiItems || []);
				} else {
					const items = listings.filter((x) => x.sellerId === id);
					const sample = items.at(0) ?? listings.at(0);
					if (sample) {
						setProfile({
							id: sample.sellerId,
							name: sample.seller,
							biography:
								"Materiais bem cuidados, negociação transparente e entrega dentro do campus.",
							telephone: "5585999991204",
						});
						setUserItems(items);
					}
				}
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

	if (!profile) {
		return <div className="p-10 text-center">Perfil indisponível.</div>;
	}

	const initials = (profile.name || "U")
		.trim()
		.split(/\s+/)
		.map((x) => x[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	const cleanPhone = (profile.telephone || "5585999991204").replace(/\D/g, "");

	return (
		<div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
			<div className="flex flex-col items-start gap-6 border-b border-border pb-8 sm:flex-row sm:items-center">
				<div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-full bg-secondary font-display text-2xl font-bold">
					{profile.photo_url ? (
						<img
							src={profile.photo_url}
							alt={profile.name}
							className="size-full object-cover"
						/>
					) : (
						initials
					)}
				</div>
				<div className="flex-1">
					<h1 className="font-display text-3xl font-bold">{profile.name}</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						{profile.role === "admin" ? "Administrador" : "Estudante UNIFOR"}
					</p>
					<p className="mt-4 max-w-xl text-muted-foreground">
						{profile.biography ||
							"Materiais bem cuidados, negociação transparente e entrega dentro do campus."}
					</p>
					<p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
						<MapPin className="size-4" />
						Fortaleza · Campus UNIFOR
					</p>
				</div>
				{profile.telephone && (
					<a
						href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
							`Olá, ${profile.name}! Encontrei seu perfil no ReCircula.`
						)}`}
						target="_blank"
						rel="noreferrer"
					>
						<Button>
							<MessageCircle className="size-4" />
							Conversar no WhatsApp
						</Button>
					</a>
				)}
			</div>
			<h2 className="mt-9 font-display text-xl font-semibold">
				Anúncios de {profile.name.split(" ")[0]} ({userItems.length})
			</h2>
			<div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{userItems.map((x) => (
					<ListingCard
						key={x.id}
						item={{
							id: x.id,
							title: x.title,
							category: x.category,
							price: x.price,
							donation: x.donation,
							image: x.image_url || x.image,
							seller: profile.name,
							course: profile.telephone || "Estudante",
						}}
					/>
				))}
				{userItems.length === 0 && (
					<p className="col-span-full py-10 text-center text-muted-foreground">
						Este usuário ainda não possui anúncios ativos.
					</p>
				)}
			</div>
		</div>
	);
}
