import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, Sparkles, Gift, Loader2 } from "lucide-react";

import { ListingCard } from "../../components/listing-card";
import { Button, Input, Select } from "../../components/ui";

import { categories } from "../../hooks/useCategories";
import useDebounce from "../../hooks/useDebounce";

import { announceApi } from "../../services/api";
import { buildCacheKey, readCacheEntry, writeCacheEntry } from "../../services/cache";
import { showLoadingToast, showToast, toast } from "../../services/toast";

function mapListing(item) {
	return {
		id: item.id,
		title: item.title,
		category: item.category,
		price: item.price,
		donation: item.donation,
		created_at: item.created_at,
		image: item.image_url,
		seller: item.user?.name || "Estudante",
		sellerPhoto: item.user?.photo_url,
		sellerId: item.user_id,
		course: item.user?.telephone || "Estudante UNIFOR",
		description: item.description,
	};
}

function getSearchScore(title = "", query = "") {
	const normalizedTitle = String(title).trim().toLowerCase();
	const normalizedQuery = String(query).trim().toLowerCase();
	if (!normalizedTitle || !normalizedQuery) return 0;

	let score = 0;
	if (normalizedTitle.includes(normalizedQuery)) score += 100;
	const words = normalizedQuery.split(/\s+/).filter(Boolean);
	for (const word of words) {
		if (normalizedTitle.includes(word)) score += 25;
	}
	const firstIndex = normalizedTitle.indexOf(normalizedQuery);
	if (firstIndex >= 0) score += Math.max(0, 50 - firstIndex);
	return score;
}

export default function Index() {
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 500);
	const [category, setCategory] = useState("Todos");
	const [donations, setDonations] = useState(false);
	const [order, setOrder] = useState("recent");
	const [listingState, setListingState] = useState({
		key: null,
		data: [],
		loading: true,
		error: null,
	});
	const [retryCount, setRetryCount] = useState(0);

	const requestParams = useMemo(
		() => ({
			category: category === "Todos" ? undefined : category,
			donation: donations ? true : undefined,
			search: debouncedQuery.trim() || undefined,
			sort: order,
		}),
		[category, donations, debouncedQuery, order]
	);
	const requestKey = buildCacheKey("marketplace:listings", requestParams);

	useEffect(() => {
		let active = true;
		const cachedListings = readCacheEntry(requestKey);
		let loadingToastId;
		let loadingToastTimer;

		setListingState({
			key: requestKey,
			data: cachedListings ?? [],
			loading: !cachedListings,
			error: null,
		});

		if (cachedListings) {
			loadingToastTimer = window.setTimeout(() => {
				if (active) loadingToastId = showLoadingToast();
			}, 1000);
		}

		announceApi
			.getAll(requestParams)
			.then((items) => {
				if (!Array.isArray(items)) {
					throw new Error("A resposta da API de anúncios é inválida.");
				}

				const mappedListings = items.map(mapListing);
				writeCacheEntry(requestKey, mappedListings);
				if (active) {
					setListingState({
						key: requestKey,
						data: mappedListings,
						loading: false,
						error: null,
					});
				}
			})
			.catch((error) => {
				console.warn("Não foi possível carregar anúncios:", error.message);
				if (active) {
					setListingState({
						key: requestKey,
						data: cachedListings ?? [],
						loading: false,
						error,
					});
					if (cachedListings) {
						showToast({
							text: "Não foi possível atualizar os anúncios.",
							color: "red",
						});
					}
				}
			})
			.finally(() => {
				window.clearTimeout(loadingToastTimer);
				if (loadingToastId) toast.dismiss(loadingToastId);
			});

		return () => {
			active = false;
			window.clearTimeout(loadingToastTimer);
			if (loadingToastId) toast.dismiss(loadingToastId);
		};
	}, [requestKey, requestParams, retryCount]);

	const hasCurrentState = listingState.key === requestKey;
	const hasCachedListings = Boolean(readCacheEntry(requestKey));
	const activeListings = useMemo(() => {
		const nextItems = hasCurrentState ? listingState.data : readCacheEntry(requestKey) ?? [];
		return Array.isArray(nextItems) ? nextItems : [];
	}, [hasCurrentState, listingState.data, requestKey]);
	const isLoading = hasCurrentState ? listingState.loading : !hasCachedListings;
	const loadError = hasCurrentState ? listingState.error : null;
	const orderedListings = useMemo(() => {
		const nextItems = [...activeListings];
		const normalizedQuery = debouncedQuery.trim().toLowerCase();
		if (!normalizedQuery) {
			if (order === "price-asc") {
				return nextItems.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
			}
			if (order === "price-desc") {
				return nextItems.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
			}
			return nextItems;
		}
		return nextItems.sort(
			(a, b) => getSearchScore(b.title, normalizedQuery) - getSearchScore(a.title, normalizedQuery)
		);
	}, [activeListings, debouncedQuery, order]);

	return (
		<>
			<section className="border-b border-border">
				<div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-18">
					<div className="max-w-3xl">
						<div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
							<Sparkles className="size-4" />
							Economia circular no campus
						</div>
						<h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
							O que você não usa pode ser exatamente o que alguém procura.
						</h1>
						<p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
							Compre, venda ou doe materiais acadêmicos entre estudantes.
							Simples, local e sem taxas.
						</p>
					</div>
					<div className="mt-9 flex max-w-3xl gap-2">
						<div className="relative flex-1">
							<Search className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
							<Input
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Busque por livro, calculadora, jaleco..."
								className="h-13 pl-11 text-base"
							/>
						</div>
						<Button className="h-13 px-5">
							<Search className="size-5" />
							<span className="hidden sm:inline">Buscar</span>
						</Button>
					</div>
				</div>
			</section>
			<section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
				<div className="mb-7 flex flex-col gap-5">
					<div className="flex gap-2 overflow-x-auto pb-1">
						{categories.map((item) => (
							<Button
								key={item}
								size="sm"
								variant={category === item ? "primary" : "secondary"}
								onClick={() => setCategory(item)}
								className="shrink-0"
							>
								{item}
							</Button>
						))}
					</div>
					<div className="flex flex-wrap items-center justify-between gap-3">
						<label className="group flex cursor-pointer select-none items-center gap-2.5 text-sm font-medium">
							<input
								type="checkbox"
								checked={donations}
								onChange={(e) => setDonations(e.target.checked)}
								className="peer sr-only"
							/>
							<span className="grid size-5 place-items-center rounded-md border border-border bg-card text-transparent shadow-sm transition-all duration-200 group-hover:border-primary/60 group-active:scale-90 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground">
								<Gift className="size-3.5" />
							</span>
							<span className="transition-colors duration-200 group-hover:text-primary">
								Somente doações
							</span>
						</label>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<SlidersHorizontal className="size-4" />
							<Select
								value={order}
								onChange={(e) => setOrder(e.target.value)}
								className="w-40 cursor-pointer"
							>
								<option value="recent">Mais recentes</option>
								<option value="price-asc">Menor preço</option>
								<option value="price-desc">Maior preço</option>
							</Select>
						</div>
					</div>
				</div>
				<div className="mb-5 flex items-end justify-between">
					<div>
						<p className="text-sm text-muted-foreground">
							{orderedListings.length} itens encontrados
						</p>
						<h2 className="mt-1 font-display text-2xl font-semibold">
							Anúncios recentes
						</h2>
					</div>
				</div>
				{isLoading && !hasCachedListings ? (
					<div className="grid min-h-64 place-items-center">
						<Loader2
							className="size-8 animate-spin text-primary"
							aria-label="Carregando anúncios"
						/>
					</div>
				) : loadError && orderedListings.length === 0 ? (
					<div className="grid min-h-64 place-items-center rounded-lg border border-dashed border-border text-center">
						<div>
							<p className="font-semibold">
								Não foi possível carregar os anúncios.
							</p>
							<button
								onClick={() => setRetryCount((count) => count + 1)}
								className="mt-2 text-sm text-primary"
							>
								Tentar novamente
							</button>
						</div>
					</div>
				) : orderedListings.length ? (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{orderedListings.map((item) => (
							<ListingCard key={item.id} item={item} />
						))}
					</div>
				) : (
					<div className="grid min-h-64 place-items-center rounded-lg border border-dashed border-border text-center">
						<div>
							<Search className="mx-auto size-8 text-muted-foreground" />
							<p className="mt-3 font-semibold">Nenhum item encontrado</p>
							<button
								onClick={() => {
									setQuery("");
									setCategory("Todos");
									setDonations(false);
								}}
								className="mt-2 text-sm text-primary"
							>
								Limpar filtros
							</button>
						</div>
					</div>
				)}
			</section>
		</>
	);
}
