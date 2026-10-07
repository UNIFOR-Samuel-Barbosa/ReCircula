import { Router } from "express";

import { authenticate } from "../middlewares/authenticate.middleware.ts.js";
import { validate } from "../middlewares/validate.middleware.js";

import * as announceController from "../controllers/announce.controller.js";

import { createAnnounceSchema } from "../schemas/announce.schema.js";
import { updateAnnounceSchema } from "../schemas/announce.schema.js";

const router = Router();

router.get("/", announceController.getAll);

router.get("/categories", announceController.getCategories);

router.get("/me/categories", authenticate, announceController.getMyCategories);

router.get("/me", authenticate, announceController.getMine);

router.get("/user/:id", announceController.getByUserId);

router.get("/:id", announceController.getById);

router.post(
	"/",
	authenticate,
	validate(createAnnounceSchema),
	announceController.create
);

router.patch(
	"/:id",
	authenticate,
	validate(updateAnnounceSchema),
	announceController.update
);

router.delete("/:id", authenticate, announceController.remove);

export default router;
