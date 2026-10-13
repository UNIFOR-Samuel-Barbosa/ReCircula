import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
	? new Resend(process.env.RESEND_API_KEY)
	: null;

const MAIL_FROM = process.env.MAIL_FROM || "ReCircula <onboarding@resend.dev>";

export async function sendPasswordResetEmail(to, link) {
	// Sem chave configurada (desenvolvimento), o link é apenas exibido no console.
	if (!resend) {
		console.info(`[mail] Link de redefinição para ${to}: ${link}`);
		return;
	}

	const { error } = await resend.emails.send({
		from: MAIL_FROM,
		to,
		subject: "Redefinição de senha — ReCircula",
		text: `Recebemos um pedido para redefinir sua senha no ReCircula.\n\nAcesse o link abaixo em até 30 minutos:\n${link}\n\nSe você não fez esse pedido, ignore este e-mail.`,
		html: `<p>Recebemos um pedido para redefinir sua senha no ReCircula.</p>
<p><a href="${link}">Clique aqui para criar uma nova senha</a>. O link expira em 30 minutos.</p>
<p>Se você não fez esse pedido, ignore este e-mail.</p>`,
	});

	if (error) throw new Error(error.message);
}
