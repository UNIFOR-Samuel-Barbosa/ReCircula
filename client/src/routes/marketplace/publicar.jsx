import { useNavigate } from "../../hooks/useNavigation";
import { useState } from "react";
import { Gift, ImagePlus } from "lucide-react";
import { Button, Field, Input, Select, Textarea } from "../../components/ui";
export default function Page() {
	const [donation, setDonation] = useState(false);
	const [preview, setPreview] = useState();
	const nav = useNavigate();
	return (
		<div className="mx-auto max-w-2xl px-4 py-10 lg:px-8">
			<p className="text-sm font-semibold text-primary">Novo anúncio</p>
			<h1 className="mt-2 font-display text-3xl font-bold">
				O que vai circular agora?
			</h1>
			<p className="mt-2 text-muted-foreground">
				Capriche nas informações para encontrar a pessoa certa.
			</p>
			<form
				className="mt-8 grid gap-6"
				onSubmit={(e) => {
					e.preventDefault();
					nav({ to: "/painel", search: { publicado: "sim" } });
				}}
			>
				<Field label="Foto do item">
					<label className="grid min-h-52 cursor-pointer place-items-center overflow-hidden rounded-lg border border-dashed border-input bg-card text-center hover:border-primary">
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
									PNG ou JPG
								</small>
							</span>
						)}
						<input
							type="file"
							accept="image/*"
							className="sr-only"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) setPreview(URL.createObjectURL(file));
							}}
						/>
					</label>
				</Field>
				<Field label="Título">
					<Input
						required
						placeholder="Ex.: Calculadora científica em ótimo estado"
					/>
				</Field>
				<div className="grid gap-5 sm:grid-cols-2">
					<Field label="Categoria">
						<Select required defaultValue="">
							<option value="" disabled>
								Selecione
							</option>
							{[
								"Livros",
								"Eletrônicos",
								"Acessórios",
								"Jalecos",
								"Engenharia",
								"Computação",
								"Móveis",
							].map((x) => (
								<option key={x}>{x}</option>
							))}
						</Select>
					</Field>
					<Field label="Preço">
						<Input
							type="number"
							min="0"
							step="0.01"
							disabled={donation}
							placeholder={donation ? "Item para doação" : "R$ 0,00"}
						/>
					</Field>
				</div>
				<label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-4">
					<input
						type="checkbox"
						className="mt-1 size-4 accent-primary"
						checked={donation}
						onChange={(e) => setDonation(e.target.checked)}
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
					/>
				</Field>
				<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<Button type="button" variant="ghost" onClick={() => history.back()}>
						Cancelar
					</Button>
					<Button type="submit">Publicar anúncio</Button>
				</div>
			</form>
		</div>
	);
}
