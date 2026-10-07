import { Router } from "express";

import { authenticate } from "../middlewares/authenticate.middleware.ts.js";
import { validate } from "../middlewares/validate.middleware.js";

import * as profileController from "../controllers/profile.controller.js";

import { updateProfileSchema } from "../schemas/profile.schema.js";

const router = Router();

router.get("/", authenticate, profileController.getMe);

router.get("/:id", profileController.getById);

router.patch(
	"/",
	authenticate,
	validate(updateProfileSchema),
	profileController.update
);

export default router;
