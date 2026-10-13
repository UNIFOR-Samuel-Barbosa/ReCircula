import { useState, useEffect } from "react";
import { Link } from "../../components/link";
import { useNavigate } from "../../hooks/useNavigation";
import { Button, Field, Input } from "../../components/ui";
import { showToast } from "../../services/toast";
import { authApi } from "../../services/api";
import { AlertCircle, Loader2 } from "lucide-react";

export default function Page() {
	const nav = useNavigate();
	const [token, setToken] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const urlToken = searchParams.get("token") || "";
		setToken(urlToken);
	}, []);

	const passwordsMismatch =
		confirmPassword.length > 0 && password !== confirmPassword;

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!token) {
			showToast({
				text: "Token de recuperação ausente ou inválido.",
				color: "red",
			});
			return;
		}

		if (passwordsMismatch || password !== confirmPassword) {
			showToast({ text: "As senhas não coincidem.", color: "red" });
			return;
		}

		setLoading(true);

		try {
			await authApi.resetPassword({ token, password });
			showToast({
				text: "Sua senha foi alterada com sucesso! Faça login com a nova senha.",
				color: "green",
			});
			nav({ to: "/entrar" });
		} catch (err) {
			showToast({
				text: err.message || "Link de recuperação inválido ou expirado.",
				color: "red",
			});
		} finally {
			setLoading(false);
		}
	};

	if (!token) {
		return (
			<div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center px-4 py-10">
				<div className="w-full text-center">
					<AlertCircle className="mx-auto size-12 text-destructive" />
					<h1 className="mt-4 font-display text-2xl font-bold">
						Link incompleto ou inválido
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						O link de recuperação não contém um token válido. Solicite uma nova
						redefinição para continuar.
					</p>
					<Link to="/recuperar-senha" className="mt-6 inline-block">
						<Button>Solicitar nova recuperação</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center px-4 py-10">
			<div className="w-full">
				<h1 className="font-display text-3xl font-bold">Criar nova senha</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Escolha e confirme sua nova senha para continuar.
				</p>
				<form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
					<Field label="Nova senha" hint="Use pelo menos 8 caracteres.">
						<Input
							type="password"
							required
							minLength={8}
							maxLength={72}
							placeholder="Digite sua nova senha"
							autoComplete="new-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={loading}
						/>
					</Field>
					<Field label="Confirmar nova senha">
						<Input
							type="password"
							required
							minLength={8}
							maxLength={72}
							placeholder="Confirme sua nova senha"
							autoComplete="new-password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							aria-invalid={passwordsMismatch}
							disabled={loading}
						/>
						{passwordsMismatch && (
							<span role="alert" className="text-xs text-destructive">
								As senhas não coincidem.
							</span>
						)}
					</Field>
					<Button
						type="submit"
						className="w-full"
						disabled={loading || passwordsMismatch}
					>
						{loading ? (
							<>
								<Loader2 className="size-4 animate-spin" />
								Salvando...
							</>
						) : (
							"Salvar nova senha"
						)}
					</Button>
				</form>
				<p className="mt-6 text-center text-sm text-muted-foreground">
					<Link to="/entrar" className="font-semibold text-primary">
						Voltar ao login
					</Link>
				</p>
			</div>
		</div>
	);
}
