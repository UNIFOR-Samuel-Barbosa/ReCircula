
import { useState } from "react";
import { Camera, Edit3, LogOut } from "lucide-react";
import { currentUser, listings } from "../../lib/demo-data";
import { ListingCard } from "../../components/listing-card";
import { Button, Field, Input, Textarea } from "../../components/ui";
import { useNavigate } from "../../lib/navigation";
import { useDemoSession } from "../../lib/demo-session";
export default function Page() {
	const nav = useNavigate();
	const { signOut } = useDemoSession();
	const [editing, setEditing] = useState(false);
	const [saved, setSaved] = useState(false);
	return (
		<div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
			<div className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-center">
				<div className="relative grid size-24 shrink-0 place-items-center rounded-full bg-secondary font-display text-2xl font-bold">
					{currentUser.initials}
					<button
						aria-label="Alterar foto"
						className="absolute bottom-0 right-0 grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"
					>
						<Camera className="size-4" />
					</button>
				</div>
				<div className="min-w-0 flex-1">
					<h1 className="font-display text-3xl font-bold">
						{currentUser.name}
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						{currentUser.course}
					</p>
					<p className="mt-4 max-w-xl leading-6 text-muted-foreground">
						{currentUser.bio}
					</p>
				</div>
				<div className="flex gap-2">
					<Button variant="secondary" onClick={() => setEditing(true)}>
						<Edit3 className="size-4" />
						Editar
					</Button>
					<Button
						variant="ghost"
						aria-label="Sair"
						onClick={() => {
							signOut();
							nav({ to: "/entrar" });
						}}
					>
						<LogOut className="size-4" />
					</Button>
				</div>
			</div>
			{saved && (
				<div className="mt-6 rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
					Perfil atualizado com sucesso.
				</div>
			)}
			<div className="mt-9">
				<h2 className="font-display text-xl font-semibold">Meus desapegos</h2>
				<div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{listings
						.filter((x) => x.sellerId === currentUser.id)
						.map((x) => (
							<ListingCard key={x.id} item={x} />
						))}
				</div>
			</div>
			{editing && (
				<div className="fixed inset-0 z-60 grid place-items-center overflow-y-auto bg-overlay px-4 py-8">
					<form
						className="w-full max-w-lg rounded-lg border border-border bg-popover p-6"
						onSubmit={(e) => {
							e.preventDefault();
							setEditing(false);
							setSaved(true);
						}}
					>
						<h2 className="font-display text-2xl font-bold">Editar perfil</h2>
						<div className="mt-6 grid gap-5">
							<Field label="Nome">
								<Input defaultValue={currentUser.name} minLength={2} />
							</Field>
							<Field label="Biografia" hint="Até 150 caracteres.">
								<Textarea maxLength={150} defaultValue={currentUser.bio} />
							</Field>
							<Field label="Telefone">
								<Input defaultValue={currentUser.phone} maxLength={20} />
							</Field>
						</div>
						<div className="mt-6 flex justify-end gap-2">
							<Button
								type="button"
								variant="ghost"
								onClick={() => setEditing(false)}
							>
								Cancelar
							</Button>
							<Button type="submit">Salvar alterações</Button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}
