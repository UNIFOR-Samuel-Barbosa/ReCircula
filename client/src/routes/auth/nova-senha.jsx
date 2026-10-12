import { useState } from "react";
import { Link } from "../../components/link";
import { useNavigate } from "../../hooks/useNavigation";
import { Button, Field, Input } from "../../components/ui";
import { showToast } from "../../service/toast";

export default function Page() {
	const nav = useNavigate();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const passwordsMismatch =
		confirmPassword.length > 0 && password !== confirmPassword;

	return (
		<div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center px-4 py-10">
			<div className="w-full">
				<h1 className="font-display text-3xl font-bold">Criar nova senha</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Escolha e confirme sua nova senha para continuar.
				</p>
				<form
					className="mt-8 grid gap-5"
					onSubmit={(e) => {
						e.preventDefault();
						if (password !== confirmPassword) return;

						showToast({ text: "Sua senha foi alterada com sucesso." });
						nav({ to: "/entrar" });
					}}
				>
					<Field label="Nova senha" hint="Use pelo menos 8 caracteres.">
						<Input
							type="password"
							required
							minLength={8}
							placeholder="Digite sua nova senha"
							autoComplete="new-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Field>
					<Field label="Confirmar nova senha">
						<Input
							type="password"
							required
							minLength={8}
							placeholder="Confirme sua nova senha"
							autoComplete="new-password"
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
					<Button type="submit" className="w-full">
						Salvar nova senha
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
