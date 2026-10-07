import { Router } from "express";

import { upload } from "../config/multer.js";

import { authenticate } from "../middlewares/authenticate.middleware.ts.js";

import * as uploadController from "../controllers/upload.controller.js";

const router = Router();

router.post("/", authenticate, upload.single("image"), uploadController.upload);

export default router;
