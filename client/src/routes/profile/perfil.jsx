import { useState, useEffect } from "react";
import { Camera, Edit3, LogOut, Loader2, Plus, Sparkles } from "lucide-react";
import { ListingCard } from "../../components/listing-card";
import { Button, Field, Input, Textarea } from "../../components/ui";
import { useNavigate } from "../../hooks/useNavigation";
import { Link } from "../../components/link";
import { useAuth } from "../../context/AuthContext";
import { announceApi } from "../../services/api";
import { showToast } from "../../services/toast";

export default function Page() {
	const nav = useNavigate();
	const { user, isLoggedIn, isLoading, signOut, updateUser } = useAuth();
	const [editing, setEditing] = useState(false);
	const [saving, setSaving] = useState(false);
	const [userAnnounces, setUserAnnounces] = useState([]);
	const [loadingAnnounces, setLoadingAnnounces] = useState(true);

	const [name, setName] = useState("");
	const [biography, setBiography] = useState("");
	const [telephone, setTelephone] = useState("");

	useEffect(() => {
		if (!isLoading && !isLoggedIn) {
			nav({ to: "/entrar" });
		}
	}, [isLoading, isLoggedIn, nav]);

	useEffect(() => {
		if (user) {
			setName(user.name || "");
			setBiography(user.biography || "");
			setTelephone(user.telephone || "");
		}
	}, [user]);

	useEffect(() => {
		if (isLoggedIn) {
			announceApi
				.getMine()
				.then((items) => {
					setUserAnnounces(items || []);
				})
				.catch((err) => {
					console.warn("Não foi possível carregar anúncios do usuário:", err);
				})
				.finally(() => {
					setLoadingAnnounces(false);
				});
		}
	}, [isLoggedIn]);

	if (isLoading || !user) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center p-10">
				<Loader2 className="size-8 animate-spin text-primary" />
			</div>
		);
	}

	const initials = user.name
		? user.name
				.trim()
				.split(/\s+/)
				.map((x) => x[0])
				.slice(0, 2)
				.join("")
				.toUpperCase()
		: "U";

	const handleSave = async (e) => {
		e.preventDefault();
		setSaving(true);

		try {
			await updateUser({
				name: name.trim(),
				biography: biography.trim() || null,
				telephone: telephone.trim() || null,
			});
			setEditing(false);
			showToast({ text: "Perfil atualizado com sucesso!", color: "green" });
		} catch (err) {
			showToast({
				text: err.message || "Erro ao atualizar perfil.",
				color: "red",
			});
		} finally {
			setSaving(false);
		}
	};

	const handleSignOut = async () => {
		await signOut();
		nav({ to: "/entrar" });
	};

	return (
		<div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
			<div className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-center">
				<div className="relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-full bg-secondary font-display text-2xl font-bold">
					{user.photo_url ? (
						<img
							src={user.photo_url}
							alt={user.name}
							className="size-full object-cover"
						/>
					) : (
						initials
					)}
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<h1 className="font-display text-3xl font-bold">{user.name}</h1>
						{user.role === "admin" && (
							<span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
								Administrador
							</span>
						)}
					</div>
					<p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
					{user.telephone && (
						<p className="mt-1 text-xs text-muted-foreground">
							Contato: {user.telephone}
						</p>
					)}
					<p className="mt-4 max-w-xl leading-6 text-muted-foreground">
						{user.biography || "Nenhuma biografia adicionada."}
					</p>
				</div>
				<div className="flex gap-2">
					<Button variant="secondary" onClick={() => setEditing(true)}>
						<Edit3 className="size-4" />
						Editar
					</Button>
					<Button variant="ghost" aria-label="Sair" onClick={handleSignOut}>
						<LogOut className="size-4" />
					</Button>
				</div>
			</div>

			<div className="mt-9">
				<div className="flex items-center justify-between">
					<h2 className="font-display text-xl font-semibold">Meus desapegos</h2>
					<Link to="/publicar">
						<Button size="sm">
							<Plus className="size-4" />
							Novo anúncio
						</Button>
					</Link>
				</div>

				{loadingAnnounces ? (
					<div className="py-12 text-center text-muted-foreground">
						<Loader2 className="mx-auto size-6 animate-spin" />
					</div>
				) : userAnnounces.length > 0 ? (
					<div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{userAnnounces.map((item) => (
							<ListingCard
								key={item.id}
								item={{
									id: item.id,
									title: item.title,
									category: item.category,
									price: item.price,
									donation: item.donation,
									image: item.image_url,
									seller: user.name,
									course: user.telephone || "Estudante",
								}}
							/>
						))}
					</div>
				) : (
					<div className="mt-6 rounded-lg border border-dashed border-border py-12 text-center">
						<Sparkles className="mx-auto size-8 text-primary" />
						<p className="mt-3 font-semibold">
							Você ainda não publicou anúncios
						</p>
						<p className="mt-1 text-sm text-muted-foreground">
							Coloque seus materiais acadêmicos para circular agora mesmo!
						</p>
						<Link to="/publicar" className="mt-4 inline-block">
							<Button size="sm">Publicar primeiro anúncio</Button>
						</Link>
					</div>
				)}
			</div>

			{editing && (
				<div className="fixed inset-0 z-60 grid place-items-center overflow-y-auto bg-overlay px-4 py-8">
					<form
						className="w-full max-w-lg rounded-lg border border-border bg-popover p-6 shadow-xl"
						onSubmit={handleSave}
					>
						<h2 className="font-display text-2xl font-bold">Editar perfil</h2>
						<div className="mt-6 grid gap-5">
							<Field label="Nome">
								<Input
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
									minLength={2}
									disabled={saving}
								/>
							</Field>
							<Field label="Biografia" hint="Até 500 caracteres.">
								<Textarea
									maxLength={500}
									value={biography}
									onChange={(e) => setBiography(e.target.value)}
									placeholder="Conte um pouco sobre você e seus materiais..."
									disabled={saving}
								/>
							</Field>
							<Field label="Telefone / WhatsApp">
								<Input
									value={telephone}
									onChange={(e) => setTelephone(e.target.value)}
									maxLength={20}
									placeholder="(85) 99999-9999"
									disabled={saving}
								/>
							</Field>
						</div>
						<div className="mt-6 flex justify-end gap-2">
							<Button
								type="button"
								variant="ghost"
								onClick={() => setEditing(false)}
								disabled={saving}
							>
								Cancelar
							</Button>
							<Button type="submit" disabled={saving}>
								{saving ? (
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
			)}
		</div>
	);
}
