import express, { Request, Response } from "express";
const router = express.Router();

import accountController from "../controllers/accountController";

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/create-account", function (req: Request, res: Response) {
  return accountController.createAccount(req, res);
});

router.get("/account-info/:id", function (req: Request, res: Response) {
  return accountController.accountInfo(req, res);
});

router.post("/add-friend", function (req: Request, res: Response) {
  console.log("adding friend");
  return accountController.addFriend(req, res);
});

router.post("/add-friend-phone", function (req: Request, res: Response) {
  return accountController.addFriendByPhone(req, res);
});

router.post(
  "/upload-profile",
  upload.single("file"),
  function (req: Request, res: Response) {
    return accountController.uploadProfilePhoto(req, res);
  }
);

router.post("/login-user", function (req: Request, res: Response) {
  return accountController.autoLoginUser(req, res);
});

router.post("/update-fcm", function (req: Request, res: Response) {
  return accountController.updateFCMToken(req, res);
});

router.post("/add-multiple-friends", function (req: Request, res: Response) {
  return accountController.addMultipleFriends(req, res);
});

export default router;
