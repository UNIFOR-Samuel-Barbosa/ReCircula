import { useState } from "react";
import { Link } from "../../components/link";
import { useNavigate } from "../../hooks/useNavigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button, Field, Input } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../service/toast";

export default function Page() {
	const nav = useNavigate();
	const { signIn } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const session = await signIn({ email, password });
			showToast({
				text: `Bem-vindo de volta, ${session.user.name}!`,
				color: "green",
			});
			if (session.user.role === "admin") {
				nav({ to: "/dashboard" });
			} else {
				nav({ to: "/" });
			}
		} catch (err) {
			showToast({
				text: err.message || "E-mail ou senha inválidos.",
				color: "red",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center px-4 py-10">
			<div className="w-full">
				<p className="text-sm font-semibold text-primary">
					Sua comunidade, seus materiais
				</p>
				<h1 className="mt-2 font-display text-3xl font-bold">
					Bem-vindo de volta
				</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Entre para publicar e gerenciar seus anúncios.
				</p>
				<form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
					<Field label="E-mail">
						<Input
							type="email"
							required
							autoComplete="email"
							placeholder="nome@edu.unifor.br"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={loading}
						/>
					</Field>
					<Field label="Senha">
						<Input
							type="password"
							required
							autoComplete="current-password"
							placeholder="Sua senha"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={loading}
						/>
					</Field>
					<Link
						to="/recuperar-senha"
						className="justify-self-end text-sm text-primary hover:underline"
					>
						Esqueci minha senha
					</Link>
					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? (
							<>
								<Loader2 className="size-4 animate-spin" />
								Entrando...
							</>
						) : (
							<>
								Entrar
								<ArrowRight className="size-4" />
							</>
						)}
					</Button>
				</form>
				<p className="mt-6 text-center text-sm text-muted-foreground">
					Ainda não tem conta?{" "}
					<Link to="/cadastro" className="font-semibold text-primary">
						Cadastre-se
					</Link>
				</p>
			</div>
		</div>
	);
}
