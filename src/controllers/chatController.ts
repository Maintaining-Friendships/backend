import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { successResponse } from "../middleware/responses";
import { IChat } from "../models/chatSchema";
import { IUser } from "../models/userSchema";
import chooseFriend from "../services/chooseFriend";

export default {
  createChat: async function (req: Request, res: Response) {
    //creates a new chat based on an algorithum in Choose Friend
    const friendId: string = await chooseFriend(req.body.userId);
    const collection = admin.firestore().collection("/chats");

    let newChat: IChat = {
      members: [req.body.userId, friendId],
      messages: [],
    };

    const chat = await collection.add(newChat);

    return successResponse(res, {
      chat,
    });
  },
};
