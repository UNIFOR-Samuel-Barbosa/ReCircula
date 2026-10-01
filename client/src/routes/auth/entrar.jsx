import { Link, useNavigate } from "../../lib/navigation";
import { useState } from "react";
import { ArrowRight, KeyRound, Mail } from "lucide-react";
import { Button, Field, Input } from "../../components/ui";
import { useDemoSession } from "../../lib/demo-session";
export default function Page() {
	const nav = useNavigate();
	const { signIn } = useDemoSession();
	const [forgot, setForgot] = useState(false);
	const [sent, setSent] = useState(false);
	return (
		<div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center px-4 py-10">
			<div className="w-full">
				<p className="text-sm font-semibold text-primary">
					Sua comunidade, seus materiais
				</p>
				<h1 className="mt-2 font-display text-3xl font-bold">
					{forgot ? "Recupere seu acesso" : "Bem-vindo de volta"}
				</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					{forgot
						? "Enviaremos as instruções para seu e-mail."
						: "Entre para publicar e gerenciar seus anúncios."}
				</p>
				{sent ? (
					<div className="mt-8 rounded-lg border border-primary/30 bg-primary/10 p-5">
						<Mail className="size-6 text-primary" />
						<p className="mt-3 font-semibold">Confira sua caixa de entrada</p>
						<p className="mt-1 text-sm text-muted-foreground">
							Enviamos um link demonstrativo de recuperação.
						</p>
						<Button
							onClick={() => setForgot(false)}
							variant="secondary"
							className="mt-5 w-full"
						>
							Voltar ao login
						</Button>
					</div>
				) : (
					<form
						className="mt-8 grid gap-5"
						onSubmit={(e) => {
							e.preventDefault();
							if (forgot) setSent(true);
							else {
								signIn();
								nav({ to: "/" });
							}
						}}
					>
						<Field label="E-mail">
							<Input type="email" required placeholder="nome@edu.unifor.br" />
						</Field>
						{!forgot && (
							<Field label="Senha">
								<Input type="password" required placeholder="Sua senha" />
							</Field>
						)}
						{!forgot && (
							<button
								type="button"
								onClick={() => setForgot(true)}
								className="justify-self-end text-sm text-primary"
							>
								Esqueci minha senha
							</button>
						)}
						<Button type="submit" className="w-full">
							{forgot ? <KeyRound className="size-4" /> : null}
							{forgot ? "Enviar instruções" : "Entrar"}
							{!forgot && <ArrowRight className="size-4" />}
						</Button>
					</form>
				)}
				{!forgot && (
					<p className="mt-6 text-center text-sm text-muted-foreground">
						Ainda não tem conta?{" "}
						<Link to="/cadastro" className="font-semibold text-primary">
							Cadastre-se
						</Link>
					</p>
				)}
			</div>
		</div>
	);
}
