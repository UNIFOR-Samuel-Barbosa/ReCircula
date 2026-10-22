import { useEffect, useState } from "react";
import { Gift, ImagePlus, Loader2 } from "lucide-react";

import { Button, Field, Input, Select, Textarea } from "../../components/ui";

import { useAuth } from "../../context/auth/AuthProvider";

import { useNavigate } from "../../hooks/useNavigation";
import { categories } from "../../hooks/useCategories";

import { announceApi } from "../../services/api";
import { showToast } from "../../services/toast";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export default function Page() {
	const nav = useNavigate();
	const { isLoggedIn, isLoading } = useAuth();

	const [donation, setDonation] = useState(false);
	const [preview, setPreview] = useState();
	const [imageFile, setImageFile] = useState(null);
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState("");
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (!isLoading && !isLoggedIn) {
			nav({ to: "/entrar" });
		}
	}, [isLoading, isLoggedIn, nav]);

	useEffect(() => {
		if (!preview) return;
		return () => URL.revokeObjectURL(preview);
	}, [preview]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title.trim() || !category || !imageFile) {
			showToast({
				text: "Preencha todos os campos obrigatórios.",
				color: "red",
			});
			return;
		}

		setSubmitting(true);

		try {
			const uploadRes = await announceApi.uploadImage(imageFile);
			if (
				typeof uploadRes?.url !== "string" ||
				!uploadRes.url.startsWith("https://")
			) {
				throw new Error(
					"O Cloudinary não retornou uma URL pública segura para a imagem."
				);
			}

			const numericPrice = donation ? null : price ? parseFloat(price) : null;

			await announceApi.create({
				title: title.trim(),
				category,
				price: numericPrice,
				donation,
				description: description.trim() || null,
				image_url: uploadRes.url,
			});

			showToast({ text: "Anúncio publicado com sucesso!", color: "green" });
			nav({ to: "/painel" });
		} catch (err) {
			showToast({
				text: err.message || "Erro ao publicar anúncio.",
				color: "red",
			});
		} finally {
			setSubmitting(false);
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
		<div className="mx-auto max-w-2xl px-4 py-10 lg:px-8">
			<p className="text-sm font-semibold text-primary">Novo anúncio</p>
			<h1 className="mt-2 font-display text-3xl font-bold">
				O que vai circular agora?
			</h1>
			<p className="mt-2 text-muted-foreground">
				Capriche nas informações para encontrar a pessoa certa.
			</p>
			<form className="mt-8 grid gap-6" onSubmit={handleSubmit}>
				<div className="grid gap-2 text-sm font-medium text-foreground">
					<span>Foto do item</span>
					<label className="grid min-h-52 cursor-pointer place-items-center overflow-hidden rounded-lg border border-dashed border-input bg-card text-center hover:border-primary transition-colors">
						{preview ? (
							<img
								src={preview}
								alt="Prévia do anúncio"
								className="h-64 w-full object-cover"
							/>
						) : (
							<span>
								<ImagePlus className="mx-auto size-8 text-primary" />
								<strong className="mt-3 block">Adicionar uma foto</strong>
								<small className="mt-1 block text-muted-foreground">
									PNG, JPG ou WEBP
								</small>
							</span>
						)}
						<input
							type="file"
							accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
							className="sr-only"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (!file) return;

								if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
									setImageFile(null);
									setPreview(undefined);
									e.target.value = "";
									showToast({
										text: "Formato inválido. Envie uma imagem PNG, JPG ou WEBP.",
										color: "red",
									});
									return;
								}

								if (file.size > MAX_IMAGE_SIZE) {
									setImageFile(null);
									setPreview(undefined);
									e.target.value = "";
									showToast({
										text: "A imagem excede o limite de 10 MB.",
										color: "red",
									});
									return;
								}

								setImageFile(file);
								setPreview(URL.createObjectURL(file));
							}}
							required
							disabled={submitting}
						/>
					</label>
					<small className="text-muted-foreground">
						Obrigatória. Formatos aceitos: PNG, JPG ou WEBP (máximo de 10 MB).
					</small>
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
				<div className="grid gap-5 sm:grid-cols-2">
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
							{categories.map((x) => (
								<option key={x} value={x}>
									{x}
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
				<label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-4">
					<input
						type="checkbox"
						className="mt-1 size-4 accent-primary"
						checked={donation}
						onChange={(e) => setDonation(e.target.checked)}
						disabled={submitting}
					/>
					<Gift className="size-5 text-primary" />
					<span>
						<strong className="block text-sm">Quero doar este item</strong>
						<small className="text-muted-foreground">
							O campo de preço será desativado.
						</small>
					</span>
				</label>
				<Field
					label="Descrição"
					hint="Conte o estado do item e onde prefere entregar."
				>
					<Textarea
						maxLength={500}
						placeholder="Descreva os detalhes importantes..."
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						disabled={submitting}
					/>
				</Field>
				<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<Button
						type="button"
						variant="ghost"
						onClick={() => history.back()}
						disabled={submitting}
					>
						Cancelar
					</Button>
					<Button type="submit" disabled={submitting}>
						{submitting ? (
							<>
								<Loader2 className="size-4 animate-spin" />
								Publicando...
							</>
						) : (
							"Publicar anúncio"
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
