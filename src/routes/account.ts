import express, { Request, Response } from "express";
const router = express.Router();

import accountController from "../controllers/accountController";

router.get("/account-info", function (req: Request, res: Response) {
  console.log("account routes accessed");
  return accountController.accountInfo(req, res);
});

export default router;
