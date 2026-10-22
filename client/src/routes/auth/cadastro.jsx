import { useState } from "react";
import { Link } from "../../components/link";
import { useNavigate } from "../../hooks/useNavigation";
import { Loader2 } from "lucide-react";
import { Button, Field, Input } from "../../components/ui";
import { useAuth } from "../../context/auth/AuthProvider";
import { showToast } from "../../services/toast";

export default function Page() {
	const nav = useNavigate();
	const { signUp } = useAuth();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const passwordsMismatch =
		confirmPassword.length > 0 && password !== confirmPassword;

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (passwordsMismatch || password !== confirmPassword) {
			showToast({ text: "As senhas não coincidem.", color: "red" });
			return;
		}

		setLoading(true);

		try {
			const session = await signUp({ name, email, password });
			showToast({
				text: `Conta criada com sucesso! Bem-vindo(a), ${session.user.name}.`,
				color: "green",
			});
			nav({ to: "/perfil" });
		} catch (err) {
			showToast({
				text: err.message || "Não foi possível criar a conta.",
				color: "red",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mx-auto max-w-md px-4 py-12">
			<h1 className="font-display text-3xl font-bold">Crie sua conta</h1>
			<p className="mt-2 text-sm text-muted-foreground">
				Leva menos de um minuto.
			</p>
			<form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
				<Field label="Nome">
					<Input
						required
						minLength={2}
						maxLength={100}
						placeholder="Seu nome completo"
						value={name}
						onChange={(e) => setName(e.target.value)}
						disabled={loading}
					/>
				</Field>
				<Field label="E-mail acadêmico">
					<Input
						required
						type="email"
						placeholder="nome@edu.unifor.br"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={loading}
					/>
				</Field>
				<Field label="Senha" hint="Use pelo menos 8 caracteres.">
					<Input
						required
						minLength={8}
						maxLength={72}
						type="password"
						placeholder="Crie uma senha"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						disabled={loading}
					/>
				</Field>
				<Field label="Confirmar senha" hint="As senhas devem ser iguais.">
					<Input
						required
						minLength={8}
						maxLength={72}
						type="password"
						placeholder="Confirme sua senha"
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
				<Button type="submit" disabled={loading || passwordsMismatch}>
					{loading ? (
						<>
							<Loader2 className="size-4 animate-spin" />
							Criando conta...
						</>
					) : (
						"Criar conta"
					)}
				</Button>
			</form>
			<p className="mt-6 text-center text-sm text-muted-foreground">
				Já possui conta?{" "}
				<Link to="/entrar" className="font-semibold text-primary">
					Entrar
				</Link>
			</p>
			<p className="mt-2 text-center text-sm text-muted-foreground">
				É administrador?{" "}
				<Link to="/cadastro-admin" className="font-semibold text-primary">
					Cadastro de admin
				</Link>
			</p>
		</div>
	);
}
