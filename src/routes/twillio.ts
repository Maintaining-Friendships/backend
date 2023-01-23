import express, { Request, Response } from "express";
const router = express.Router();
const twilio = require("twilio");

import chatController from "../controllers/chatController";

router.post(
  "/receive-sms",
  twilio.webhook(),
  function (req: Request, res: Response) {
    return chatController.receiveSms(req, res);
  }
);

export default router;
