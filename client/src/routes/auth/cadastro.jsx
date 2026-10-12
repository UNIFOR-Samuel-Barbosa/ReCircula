import { Link } from "../../components/link";
import { useNavigate } from "../../hooks/useNavigation";
import { Button, Field, Input } from "../../components/ui";
import { useDemoSession } from "../../lib/demo-session";
import { useState } from "react";
export default function Page() {
	const nav = useNavigate();
	const { signIn } = useDemoSession();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const passwordsMismatch =
		confirmPassword.length > 0 && password !== confirmPassword;
	return (
		<div className="mx-auto max-w-md px-4 py-12">
			<h1 className="font-display text-3xl font-bold">Crie sua conta</h1>
			<p className="mt-2 text-sm text-muted-foreground">
				Leva menos de um minuto.
			</p>
			<form
				className="mt-8 grid gap-5"
				onSubmit={(e) => {
					e.preventDefault();
					if (password !== confirmPassword) return;
					signIn();
					nav({ to: "/perfil" });
				}}
			>
				<Field label="Nome">
					<Input required minLength={2} placeholder="Seu nome completo" />
				</Field>
				<Field label="E-mail acadêmico">
					<Input required type="email" placeholder="nome@edu.unifor.br" />
				</Field>
				<Field label="Senha" hint="Use pelo menos 8 caracteres.">
					<Input
						required
						minLength={8}
						type="password"
						placeholder="Crie uma senha"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</Field>
				<Field label="Confirmar senha" hint="As senhas devem ser iguais.">
					<Input
						required
						minLength={8}
						type="password"
						placeholder="Confirme sua senha"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						aria-invalid={passwordsMismatch}
					/>
					{passwordsMismatch && (
						<span role="alert" className="text-xs text-destructive">
							As senhas não coincidem.
						</span>
					)}
				</Field>
				<Button type="submit">Criar conta</Button>
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
