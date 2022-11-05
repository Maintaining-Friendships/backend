import { Router } from "express";
import ensureAuthorized from "../middleware/auth";
const router = Router();

import accountRoutes from "./account";
import stimulusRoutes from "./stimulus";
import authRoutes from "./auth_routes";

router.use("/auth", authRoutes);
router.use("/account", ensureAuthorized, accountRoutes);
router.use("/stimulus", ensureAuthorized, stimulusRoutes);

export default router;
