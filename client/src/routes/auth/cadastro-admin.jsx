import { Link } from "../../components/link";
import { useNavigate } from "../../hooks/useNavigation";
import { ShieldCheck } from "lucide-react";
import { Button, Field, Input } from "../../components/ui";
import { useDemoSession } from "../../lib/demo-session";
import { useState } from "react";
export default function Page() {
	const nav = useNavigate();
	const { signInAsAdmin } = useDemoSession();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const passwordsMismatch =
		confirmPassword.length > 0 && password !== confirmPassword;
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
			<form
				className="mt-8 grid gap-5"
				onSubmit={(e) => {
					e.preventDefault();
					if (password !== confirmPassword) return;
					signInAsAdmin();
					nav({ to: "/dashboard" });
				}}
			>
				<Field label="Nome">
					<Input required minLength={2} placeholder="Seu nome completo" />
				</Field>
				<Field label="E-mail institucional">
					<Input required type="email" placeholder="admin@unifor.br" />
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
				<Button type="submit">Criar conta de administrador</Button>
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
