import { Router } from "express";

import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import * as profileController from "../controllers/profile.controller.js";

import { updateProfileSchema } from "../schemas/profile.schema.js";

import { requireAdmin } from "../middlewares/authorize.middleware.js";

const router = Router();

router.get("/", authenticate, profileController.getMe);

router.get("/all", authenticate, requireAdmin, profileController.getAll);

router.get("/:id", profileController.getById);

router.patch(
	"/",
	authenticate,
	validate(updateProfileSchema),
	profileController.update
);

router.delete("/:id", authenticate, requireAdmin, profileController.remove);

export default router;

