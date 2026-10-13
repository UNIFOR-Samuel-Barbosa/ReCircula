import { useState } from "react";
import { Link } from "../../components/link";
import { useNavigate } from "../../hooks/useNavigation";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Button, Field, Input } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../service/toast";

export default function Page() {
	const nav = useNavigate();
	const { signUpAdmin } = useAuth();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [accessCode, setAccessCode] = useState("");
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
			const session = await signUpAdmin({
				name,
				email,
				password,
				accessCode,
			});
			showToast({
				text: `Conta de administrador criada com sucesso! Bem-vindo(a), ${session.user.name}.`,
				color: "green",
			});
			nav({ to: "/dashboard" });
		} catch (err) {
			showToast({
				text: err.message || "Código de acesso inválido ou falha no cadastro.",
				color: "red",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mx-auto max-w-md px-4 py-12">
			<div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
				<ShieldCheck className="size-3.5" />
				Acesso administrativo
			</div>
			<h1 className="mt-4 font-display text-3xl font-bold">
				Cadastro de administrador
			</h1>
			<p className="mt-2 text-sm text-muted-foreground">
				Administradores podem gerenciar usuários e anúncios da plataforma.
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
				<Field label="E-mail institucional">
					<Input
						required
						type="email"
						placeholder="admin@unifor.br"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={loading}
					/>
				</Field>
				<Field
					label="Código de acesso administrativo"
					hint="Código secreto fornecido aos administradores da plataforma."
				>
					<Input
						required
						placeholder="Digite o código de acesso"
						value={accessCode}
						onChange={(e) => setAccessCode(e.target.value)}
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
							Criando conta de administrador...
						</>
					) : (
						"Criar conta de administrador"
					)}
				</Button>
			</form>
			<p className="mt-6 text-center text-sm text-muted-foreground">
				É estudante?{" "}
				<Link to="/cadastro" className="font-semibold text-primary">
					Cadastro comum
				</Link>
			</p>
		</div>
	);
}
