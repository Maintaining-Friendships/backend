import express, { Request, Response } from "express";
const router = express.Router();

import accountController from "../controllers/accountController";
import chatController from "../controllers/chatController";

router.get("/chatFriends", function (req: Request, res: Response) {
  console.log("give a random friend to start a chat with");
  return chatController.chooseFriend(req, res);
});

export default router;
