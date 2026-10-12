import { Router } from "express";

import { validate } from "../middlewares/validate.middleware.js";

import * as authController from "../controllers/auth.controller.js";

import {
	forgotPasswordSchema,
	loginSchema,
	refreshTokenSchema,
	registerAdminSchema,
	registerSchema,
	resetPasswordSchema,
} from "../schemas/auth.schema.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);

router.post(
	"/register-admin",
	validate(registerAdminSchema),
	authController.registerAdmin
);

router.post("/login", validate(loginSchema), authController.login);

router.post("/refresh", validate(refreshTokenSchema), authController.refresh);

router.post("/logout", validate(refreshTokenSchema), authController.logout);

router.post(
	"/forgot-password",
	validate(forgotPasswordSchema),
	authController.forgotPassword
);

router.post(
	"/reset-password",
	validate(resetPasswordSchema),
	authController.resetPassword
);

export default router;
