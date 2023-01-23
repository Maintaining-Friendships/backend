import { Router } from "express";
import ensureAuthorized from "../middleware/auth";
const router = Router();

import accountRoutes from "./account";
import stimulusRoutes from "./stimulus";
import authRoutes from "./auth_routes";
import chatRoutes from "./chat";
import twilioRoutes from "./twillio";

router.use("/auth", authRoutes);
router.use("/twilio", twilioRoutes);
router.use("/account", ensureAuthorized, accountRoutes);
router.use("/stimulus", ensureAuthorized, stimulusRoutes);
router.use("/chat", ensureAuthorized, chatRoutes);

export default router;
