import { useEffect, useState } from "react";
import { Link } from "../../components/link";
import { useParams } from "../../hooks/useNavigation";
import { ArrowLeft, MessageCircle, ShieldCheck, Loader2 } from "lucide-react";
import { formatPrice } from "../../lib/demo-data";
import {
	formatRelativeTime,
	normalizeTelephone,
} from "../../lib/formatters";
import { Button } from "../../components/ui";
import { announceApi } from "../../services/api";

export default function Page() {
	const { id } = useParams();
	const [item, setItem] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		announceApi
			.getById(id)
			.then((apiItem) => {
				if (!apiItem) {
					setItem(null);
					return;
				}

				setItem({
					id: apiItem.id,
					title: apiItem.title,
					category: apiItem.category,
					price: apiItem.price,
					donation: apiItem.donation,
					image: apiItem.image_url,
					createdAt: apiItem.created_at,
					seller: apiItem.user?.name,
					sellerId: apiItem.user_id,
					sellerPhoto: apiItem.user?.photo_url,
					sellerRole: apiItem.user?.role,
					phone: apiItem.user?.telephone,
					description: apiItem.description,
				});
			})
			.catch((err) => {
				setError(err.message || "Não foi possível carregar este anúncio.");
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

	if (error) {
		return <div className="p-10 text-center">{error}</div>;
	}

	if (!item) {
		return <div className="p-10 text-center">Anúncio indisponível.</div>;
	}

	const phoneDigits = normalizeTelephone(item.phone);
	const cleanPhone = phoneDigits ? `55${phoneDigits}` : "";
	const initials = (item.seller || "Usuário")
		.trim()
		.split(/\s+/)
		.map((part) => part[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
	const publishedAt = formatRelativeTime(item.createdAt);

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
					{item.description && (
						<p className="mt-6 leading-7 text-muted-foreground">
							{item.description}
						</p>
					)}
					{publishedAt && (
						<p className="mt-4 text-sm text-muted-foreground">
							Criado {publishedAt}
						</p>
					)}
					<div className="mt-8 border-y border-border py-5">
						<Link
							to="/usuario/$id"
							params={{ id: item.sellerId }}
							className="flex items-center gap-3"
						>
							<span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-secondary font-bold">
								{item.sellerPhoto ? (
									<img
										src={item.sellerPhoto}
										alt={item.seller || "Foto do vendedor"}
										className="size-full object-cover"
									/>
								) : (
									initials
								)}
							</span>
							<span>
								<strong className="block">{item.seller || "Usuário"}</strong>
								<small className="text-muted-foreground">
									{item.sellerRole === "admin" ? "Administrador" : "Usuário ReCircula"}
								</small>
							</span>
							<span className="ml-auto text-sm text-primary">Ver perfil</span>
						</Link>
					</div>
					{cleanPhone ? (
						<a
							className="mt-6"
							href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
								`Olá! Vi o seu anúncio “${item.title}” no ReCircula.`
							)}`}
							target="_blank"
							rel="noreferrer"
						>
							<Button className="w-full">
								<MessageCircle className="size-5" />
								Conversar no WhatsApp
							</Button>
						</a>
					) : (
						<p className="mt-6 text-center text-sm text-muted-foreground">
							O vendedor não informou um telefone para contato.
						</p>
					)}
					<p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
						<ShieldCheck className="size-4" />
						Combine o local de entrega diretamente com o vendedor.
					</p>
				</div>
			</div>
		</div>
	);
}
