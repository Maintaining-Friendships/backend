import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { IChat } from "../models/chatSchema";
import { IUser } from "../models/userSchema";
import chooseFriend from "../services/chooseFriend";

export default {
  createChat: async function (req: Request, res: Response) {
    const friendId: string = await chooseFriend(req.body.userId);
    let newChat: IChat = {
      members: [],
      messages: [],
    };
  },
};
