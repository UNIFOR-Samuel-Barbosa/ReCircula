export const authConfig = {
	jwtSecret: process.env.JWT_SECRET,
	accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
	refreshTokenDays: Number(process.env.REFRESH_TOKEN_DAYS) || 7,
	passwordResetMinutes: 30,
	bcryptRounds: 10,
	adminSignupCode: process.env.ADMIN_SIGNUP_CODE,
	frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
};

if (!authConfig.jwtSecret) {
	throw new Error("JWT_SECRET não configurado.");
}
