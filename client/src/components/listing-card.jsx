import { Link } from "../lib/navigation";
import { Gift, MapPin } from "lucide-react";
import { formatPrice } from "../lib/demo-data";
export function ListingCard({ item }) {
	return (
		<article className="group overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-card-hover">
			<Link to="/anuncio/$id" params={{ id: item.id }} className="block">
				<div className="relative aspect-4/3 overflow-hidden bg-secondary">
					<img
						src={item.image}
						alt={item.title}
						width={960}
						height={720}
						loading="lazy"
						className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
					/>
					{item.donation && (
						<span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
							<Gift className="size-3.5" />
							Doação
						</span>
					)}
				</div>
				<div className="p-4">
					<div className="mb-2 flex items-center justify-between gap-3">
						<span className="text-xs font-medium text-muted-foreground">
							{item.category}
						</span>
						<span className="text-xs text-muted-foreground">{item.time}</span>
					</div>
					<h2 className="line-clamp-2 min-h-12 font-display text-base font-semibold leading-6">
						{item.title}
					</h2>
					<p className="mt-2 text-lg font-bold text-primary">
						{formatPrice(item)}
					</p>
					<div className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
						<span className="grid size-6 place-items-center rounded-full bg-secondary font-bold text-foreground">
							{item.seller
								.split(" ")
								.map((part) => part[0])
								.slice(0, 2)
								.join("")}
						</span>
						<span className="truncate">{item.seller}</span>
						<MapPin className="ml-auto size-3.5" />
						<span>Campus</span>
					</div>
				</div>
			</Link>
		</article>
	);
}
