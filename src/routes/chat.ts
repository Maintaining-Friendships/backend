import express, { Request, Response } from "express";
const router = express.Router();

import chatController from "../controllers/chatController";

router.post("/create-chat", function (req: Request, res: Response) {
  return chatController.createChat(req, res);
});

router.post("/create-chat-cron", function (req: Request, res: Response) {
  return chatController.createChatCron(req, res);
});

router.post("/send-message", function (req: Request, res: Response) {
  return chatController.sendMessage(req, res);
});

router.post("/receive-sms", function (req: Request, res: Response) {
  return chatController.receiveSms(req, res);
});

router.post("/send-notification", function (req: Request, res: Response) {
  return chatController.sendNotification(req, res);
});

export default router;
