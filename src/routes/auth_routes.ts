import express, { Request, Response } from "express";
const router = express.Router();

import accountController from "../controllers/accountController";
import authController from "../controllers/authController";

router.post("/get-otp", function (req: Request, res: Response) {
  return authController.getOtp(req, res);
});

router.post("/verify-otp", function (req: Request, res: Response) {
  authController.verifyUser(req, res);
});

export default router;
