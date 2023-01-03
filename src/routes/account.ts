import express, { Request, Response } from "express";
const router = express.Router();

import accountController from "../controllers/accountController";

router.post("/create-account", function (req: Request, res: Response) {
  return accountController.createAccount(req, res);
});

router.get("/account-info", function (req: Request, res: Response) {
  return accountController.accountInfo(req, res);
});

router.post("/add-friend", function (req: Request, res: Response) {
  console.log("adding friend");
  return accountController.addFriend(req, res);
});

export default router;
