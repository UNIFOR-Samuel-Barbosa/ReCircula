import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Camera, Edit3, LogOut, Loader2, Plus, Sparkles } from "lucide-react";
import { ListingCard } from "../../components/listing-card";
import { Button, Field, Input, Textarea } from "../../components/ui";
import { useNavigate } from "../../hooks/useNavigation";
import { Link } from "../../components/link";
import { useAuth } from "../../context/AuthContext";
import { announceApi } from "../../services/api";
import { showToast } from "../../services/toast";
import {
	formatTelephone,
	getCountryCodeFromTelephone,
	normalizeTelephone,
} from "../../lib/formatters";

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
	const [countryCode, setCountryCode] = useState("");
	const [includeCountryCode, setIncludeCountryCode] = useState(false);
	const telephoneInputRef = useRef(null);
	const countryCodeInputRef = useRef(null);
	const pendingTelephoneCaret = useRef(null);
	const pendingCountryCodeCaret = useRef(null);

	useLayoutEffect(() => {
		if (pendingTelephoneCaret.current === null) return;
		telephoneInputRef.current?.setSelectionRange(
			pendingTelephoneCaret.current,
			pendingTelephoneCaret.current
		);
		pendingTelephoneCaret.current = null;
	}, [telephone]);

	useLayoutEffect(() => {
		if (pendingCountryCodeCaret.current === null) return;
		countryCodeInputRef.current?.setSelectionRange(
			pendingCountryCodeCaret.current,
			pendingCountryCodeCaret.current
		);
		pendingCountryCodeCaret.current = null;
	}, [countryCode]);

	useEffect(() => {
		if (!isLoading && !isLoggedIn) {
			nav({ to: "/entrar" });
		}
	}, [isLoading, isLoggedIn, nav]);

	useEffect(() => {
		if (user) {
			setName(user.name || "");
			setBiography(user.biography || "");
			const storedDigits = String(user.telephone || "").replace(/\D/g, "");
			const countryCodeDigits = getCountryCodeFromTelephone(storedDigits);
			const hasCountryCode = Boolean(countryCodeDigits);
			const normalizedDigits = normalizeTelephone(storedDigits);

			setIncludeCountryCode(hasCountryCode);
			setCountryCode(hasCountryCode ? countryCodeDigits : "");
			setTelephone(normalizedDigits);
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

	const caretAfterDigitCount = (value, digitCount) => {
		if (digitCount === 0) return 0;
		let digitsSeen = 0;
		for (let index = 0; index < value.length; index += 1) {
			if (/\d/.test(value[index])) digitsSeen += 1;
			if (digitsSeen === digitCount) return index + 1;
		}
		return value.length;
	};

	const handleTelephoneChange = (event) => {
		const inputValue = event.target.value;
		const cursor = event.target.selectionStart ?? inputValue.length;
		const digitsBeforeCursor = inputValue
			.slice(0, cursor)
			.replace(/\D/g, "").length;
		const nextTelephone = normalizeTelephone(inputValue);
		const nextDisplay = formatTelephone(nextTelephone);
		const nextCursor = caretAfterDigitCount(
			nextDisplay,
			Math.min(nextTelephone.length, Math.max(0, digitsBeforeCursor))
		);

		pendingTelephoneCaret.current = nextCursor;
		setTelephone(nextTelephone);
	};

	const handleCountryCodeChange = (event) => {
		const rawValue = event.target.value.replace(/\D/g, "").slice(0, 3);
		const nextCountryCode = rawValue;
		const caret = event.target.selectionStart ?? rawValue.length;
		pendingCountryCodeCaret.current = Math.min(caret, rawValue.length);
		setCountryCode(nextCountryCode);
	};

	const handleTelephoneKeyDown = (event) => {
		if (
			(event.key !== "Backspace" && event.key !== "Delete") ||
			event.currentTarget.selectionStart !==
				event.currentTarget.selectionEnd
		) {
			return;
		}

		const display = formatTelephone(telephone);
		const cursor = event.currentTarget.selectionStart;
		const backward = event.key === "Backspace";
		let punctuationIndex = backward ? cursor - 1 : cursor;
		if (
			punctuationIndex < 0 ||
			punctuationIndex >= display.length ||
			/\d/.test(display[punctuationIndex])
		) {
			return;
		}

		while (
			punctuationIndex >= 0 &&
			punctuationIndex < display.length &&
			!/\d/.test(display[punctuationIndex])
		) {
			punctuationIndex += backward ? -1 : 1;
		}
		if (punctuationIndex < 0 || punctuationIndex >= display.length) return;

		const digitIndex = display
			.slice(0, punctuationIndex)
			.replace(/\D/g, "").length;
		const removedDigitIndex = backward ? digitIndex - 1 : digitIndex;
		if (removedDigitIndex < 0 || removedDigitIndex >= telephone.length) return;

		event.preventDefault();
		const nextTelephone =
			telephone.slice(0, removedDigitIndex) +
			telephone.slice(removedDigitIndex + 1);
		pendingTelephoneCaret.current = caretAfterDigitCount(
			formatTelephone(nextTelephone),
			removedDigitIndex
		);
		setTelephone(nextTelephone);
	};

	const handleSave = async (e) => {
		e.preventDefault();
		setSaving(true);

		try {
			const sanitizedCountryCode = includeCountryCode
				? countryCode.replace(/\D/g, "").slice(0, 3)
				: "";
			const savedTelephone = [sanitizedCountryCode, normalizeTelephone(telephone)]
				.filter(Boolean)
				.join("");

			await updateUser({
				name: name.trim(),
				biography: biography.trim() || null,
				telephone: savedTelephone || null,
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
							Contato: {formatTelephone(user.telephone)}
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
									created_at: item.created_at,
									seller: user.name,
									course: user.telephone ?? "",
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
							<div className="grid gap-2 text-sm font-medium text-foreground">
								<label htmlFor="profile-telephone">Telefone / WhatsApp</label>
								<div className="flex items-center gap-2">
									{includeCountryCode && (
										<div className="flex items-center gap-2 rounded-md border border-input bg-secondary px-2 py-1.5">
											<span className="text-sm text-muted-foreground">+</span>
											<Input
												ref={countryCodeInputRef}
												type="tel"
												inputMode="numeric"
												value={countryCode}
												onChange={handleCountryCodeChange}
												placeholder="55"
												maxLength={3}
												className="w-16 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
												disabled={saving}
											/>
										</div>
									)}
									<Input
										id="profile-telephone"
										ref={telephoneInputRef}
										type="tel"
										inputMode="numeric"
										value={formatTelephone(telephone)}
										onChange={handleTelephoneChange}
										onKeyDown={handleTelephoneKeyDown}
										maxLength={16}
										placeholder="(99) 9 9999-9999"
										disabled={saving}
									/>
								</div>
								<label className="flex items-center gap-2 text-xs font-normal text-muted-foreground">
									<input
										type="checkbox"
										checked={includeCountryCode}
										onChange={(event) => {
											const checked = event.target.checked;
											setIncludeCountryCode(checked);
											if (!checked) setCountryCode("");
										}}
										disabled={saving}
									/>
									Incluir código do país
								</label>
							</div>
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
