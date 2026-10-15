import { Link } from "../../components/link";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
	Plus,
	Search,
	Trash2,
	Loader2,
	Sparkles,
	Pencil,
	ImagePlus,
	Gift,
	X,
} from "lucide-react";
import { formatPrice } from "../../lib/demo-data";
import { Button, Input, Field, Select, Textarea } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { announceApi } from "../../services/api";
import { useNavigate } from "../../hooks/useNavigation";
import { showToast } from "../../services/toast";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const CATEGORIES = [
	"Livros",
	"Eletrônicos",
	"Acessórios",
	"Jalecos",
	"Engenharia",
	"Computação",
	"Móveis",
	"Outros",
];

function EditAnnounceModal({ item, onClose, onSave }) {
	const [title, setTitle] = useState(item.title || "");
	const [category, setCategory] = useState(item.category || "");
	const [donation, setDonation] = useState(Boolean(item.donation));
	const [price, setPrice] = useState(
		item.donation ? "" : item.price != null ? String(item.price) : ""
	);
	const [description, setDescription] = useState(item.description || "");
	const [imageFile, setImageFile] = useState(null);
	const [preview, setPreview] = useState(item.image_url || item.image || "");
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape" && !submitting) {
				onClose();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose, submitting]);

	useEffect(() => {
		return () => {
			if (imageFile && preview && preview.startsWith("blob:")) {
				URL.revokeObjectURL(preview);
			}
		};
	}, [imageFile, preview]);

	const handleImageChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
			e.target.value = "";
			showToast({
				text: "Formato inválido. Envie uma imagem PNG, JPG ou WEBP.",
				color: "red",
			});
			return;
		}

		if (file.size > MAX_IMAGE_SIZE) {
			e.target.value = "";
			showToast({
				text: "A imagem excede o limite de 10 MB.",
				color: "red",
			});
			return;
		}

		setImageFile(file);
		setPreview(URL.createObjectURL(file));
	};

	const handleRevertImage = () => {
		setImageFile(null);
		setPreview(item.image_url || item.image || "");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title.trim()) {
			showToast({ text: "O título é obrigatório.", color: "red" });
			return;
		}
		if (!category) {
			showToast({ text: "Selecione uma categoria.", color: "red" });
			return;
		}
		if (!donation) {
			if (price === "" || isNaN(Number(price)) || Number(price) < 0) {
				showToast({
					text: "Informe um preço válido (não negativo).",
					color: "red",
				});
				return;
			}
		}

		setSubmitting(true);
		try {
			let finalImageUrl = item.image_url || item.image;

			if (imageFile) {
				const uploadRes = await announceApi.uploadImage(imageFile);
				if (
					typeof uploadRes?.url !== "string" ||
					!uploadRes.url.startsWith("https://")
				) {
					throw new Error(
						"O Cloudinary não retornou uma URL pública válida para a imagem."
					);
				}
				finalImageUrl = uploadRes.url;
			}

			const numericPrice = donation
				? null
				: price !== ""
				? parseFloat(price)
				: null;

			const payload = {
				title: title.trim(),
				category,
				price: numericPrice,
				donation,
				description: description.trim() || null,
			};

			if (finalImageUrl) {
				payload.image_url = finalImageUrl;
			}

			const updated = await announceApi.update(item.id, payload);

			onSave({
				...item,
				...payload,
				...(updated || {}),
			});
			showToast({ text: "Anúncio atualizado com sucesso!", color: "green" });
			onClose();
		} catch (err) {
			showToast({
				text: err.message || "Erro ao atualizar anúncio.",
				color: "red",
			});
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div
			className="fixed inset-0 z-60 grid place-items-center overflow-y-auto bg-overlay px-4 py-8"
			role="dialog"
			aria-modal="true"
			aria-labelledby="edit-dialog-title"
		>
			<div className="w-full max-w-xl rounded-lg border border-border bg-popover p-6 shadow-2xl animate-in fade-in duration-150">
				<div className="flex items-center justify-between border-b border-border pb-4">
					<div>
						<h2
							id="edit-dialog-title"
							className="font-display text-2xl font-bold"
						>
							Editar anúncio
						</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Atualize as informações do seu anúncio acadêmico.
						</p>
					</div>
					<Button
						variant="ghost"
						size="icon"
						aria-label="Fechar"
						onClick={onClose}
						disabled={submitting}
					>
						<X className="size-5" />
					</Button>
				</div>

				<form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
					{/* Foto do item */}
					<div className="grid gap-2 text-sm font-medium text-foreground">
						<span>Foto do anúncio</span>
						<div className="flex flex-col sm:flex-row items-center gap-4 rounded-lg border border-border/80 bg-secondary/30 p-3">
							<div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-md border border-border bg-card">
								{preview ? (
									<img
										src={preview}
										alt="Prévia"
										className="h-full w-full object-cover"
									/>
								) : (
									<div className="grid h-full w-full place-items-center text-muted-foreground">
										<ImagePlus className="size-6 text-primary" />
									</div>
								)}
							</div>
							<div className="flex-1 space-y-2 text-center sm:text-left">
								<p className="text-xs text-muted-foreground">
									Formatos aceitos: PNG, JPG ou WEBP (máximo de 10 MB).
								</p>
								<div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
									<label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-accent transition-colors">
										<ImagePlus className="size-3.5 text-primary" />
										<span>{imageFile ? "Trocar foto" : "Alterar foto"}</span>
										<input
											type="file"
											accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
											className="sr-only"
											onChange={handleImageChange}
											disabled={submitting}
										/>
									</label>
									{imageFile && (
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="h-7 text-xs"
											onClick={handleRevertImage}
											disabled={submitting}
										>
											Reverter foto
										</Button>
									)}
								</div>
							</div>
						</div>
					</div>

					<Field label="Título">
						<Input
							required
							placeholder="Ex.: Calculadora científica em ótimo estado"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							disabled={submitting}
						/>
					</Field>

					<div className="grid gap-4 sm:grid-cols-2">
						<Field label="Categoria">
							<Select
								required
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								disabled={submitting}
							>
								<option value="" disabled>
									Selecione uma categoria
								</option>
								{CATEGORIES.map((c) => (
									<option key={c} value={c}>
										{c}
									</option>
								))}
							</Select>
						</Field>

						<Field label="Preço">
							<Input
								type="number"
								min="0"
								step="0.01"
								disabled={donation || submitting}
								placeholder={donation ? "Item para doação" : "R$ 0,00"}
								value={donation ? "" : price}
								onChange={(e) => setPrice(e.target.value)}
								required={!donation}
							/>
						</Field>
					</div>

					<label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-3.5 transition-colors hover:bg-accent/40">
						<input
							type="checkbox"
							className="mt-1 size-4 accent-primary"
							checked={donation}
							onChange={(e) => setDonation(e.target.checked)}
							disabled={submitting}
						/>
						<Gift className="size-5 shrink-0 text-primary" />
						<span>
							<strong className="block text-sm">Quero doar este item</strong>
							<small className="text-xs text-muted-foreground">
								O campo de preço será desativado e exibido como "Doação".
							</small>
						</span>
					</label>

					<Field
						label="Descrição"
						hint="Descreva o estado de conservação, detalhes e entrega."
					>
						<Textarea
							maxLength={500}
							placeholder="Descreva os detalhes importantes..."
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							disabled={submitting}
						/>
					</Field>

					<div className="mt-2 flex justify-end gap-2 border-t border-border pt-4">
						<Button
							type="button"
							variant="ghost"
							onClick={onClose}
							disabled={submitting}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={submitting}>
							{submitting ? (
								<>
									<Loader2 className="size-4 animate-spin" />
									Salvando...
								</>
							) : (
								"Salvar alterações"
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default function Page() {
	const nav = useNavigate();
	const { isLoggedIn, isLoading } = useAuth();
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [target, setTarget] = useState();
	const [deleting, setDeleting] = useState(false);
	const [editingItem, setEditingItem] = useState(null);

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
									aria-label="Editar anúncio"
									onClick={() => setEditingItem(item)}
								>
									<Pencil className="size-4 text-foreground hover:text-primary transition-colors" />
								</Button>
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

			{editingItem && (
				<EditAnnounceModal
					item={editingItem}
					onClose={() => setEditingItem(null)}
					onSave={(updatedItem) => {
						setItems((prev) =>
							prev.map((x) =>
								x.id === updatedItem.id ? { ...x, ...updatedItem } : x
							)
						);
					}}
				/>
			)}
		</div>
	);
}
