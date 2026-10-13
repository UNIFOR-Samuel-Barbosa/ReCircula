import { useState } from "react";
import { Link } from "../../components/link";
import { Button, Field, Input } from "../../components/ui";
import { showToast } from "../../service/toast";
import { authApi } from "../../services/api";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function Page() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			await authApi.forgotPassword(email);
			setSent(true);
			showToast({
				text: "Instruções enviadas! Verifique sua caixa de entrada.",
				color: "green",
			});
		} catch (err) {
			showToast({
				text: err.message || "Não foi possível enviar o link de recuperação.",
				color: "red",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center px-4 py-10">
			<div className="w-full">
				<h1 className="font-display text-3xl font-bold">Recuperar senha</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Informe seu e-mail para receber as instruções de troca de senha.
				</p>

				{sent ? (
					<div className="mt-8 rounded-lg border border-primary/30 bg-primary/10 p-5 text-center">
						<CheckCircle2 className="mx-auto size-8 text-primary" />
						<h2 className="mt-2 font-display text-lg font-bold">
							E-mail enviado!
						</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Se o e-mail <strong>{email}</strong> estiver cadastrado, você
							receberá o link para criar uma nova senha.
						</p>
						<p className="mt-2 text-xs text-muted-foreground">
							(Em ambiente local/desenvolvimento sem chave de e-mail, confira o
							console do servidor).
						</p>
						<Link to="/entrar" className="mt-4 inline-block text-sm font-semibold text-primary">
							Voltar ao login
						</Link>
					</div>
				) : (
					<form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
						<Field label="E-mail">
							<Input
								type="email"
								required
								placeholder="nome@edu.unifor.br"
								autoComplete="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={loading}
							/>
						</Field>
						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? (
								<>
									<Loader2 className="size-4 animate-spin" />
									Enviando...
								</>
							) : (
								"Enviar instruções"
							)}
						</Button>
					</form>
				)}

				<p className="mt-6 text-center text-sm text-muted-foreground">
					Lembrou sua senha?{" "}
					<Link to="/entrar" className="font-semibold text-primary">
						Voltar ao login
					</Link>
				</p>
			</div>
		</div>
	);
}
