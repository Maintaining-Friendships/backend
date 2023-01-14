import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { successResponse } from "../middleware/responses";
import { IChat, IMessage } from "../models/chatSchema";
import { createChat } from "../services/chat/autoCreateChat";
import validatePhoneForE164 from "../services/validatePhone";
import { Timestamp } from "@google-cloud/firestore";

export default {
  createChat: async function (req: Request, res: Response) {
    //creates a new chat based on an algorithum in Choose Friend
    const userId = req.body.userId;
    //creates a new chat based on an algorithum in Choose Friend
    //the friend can either be a Phone Number or a User ID
    const chat = createChat(userId);

    return successResponse(res, {
      chat,
    });
  },
  createChatCron: async function (req: Request, res: Response) {
    const usersRef = admin.firestore().collection("/users");
    let userIds: Set<string> = new Set();

    // Get the current time
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Define the query
    const convoNull = usersRef.where("lastConvo", "==", null);

    const dateBefore = usersRef.where(
      "lastConvo",
      "<",
      admin.firestore.Timestamp.fromDate(threeDaysAgo)
    );

    await convoNull.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        userIds.add(doc.id);
      });
    });

    await dateBefore.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        userIds.add(doc.id);
      });
    });

    userIds.forEach(async (userId: string) => await createChat(userId));
    successResponse(res, { ...userIds.entries });
  },
  sendMessage: async function (req: Request, res: Response) {
    const chatId = req.body.chatId;
    const senderId = req.body.senderId;
    const message = req.body.message;

    const chatsRef = admin.firestore().collection("/chats");
    const snapshot = chatsRef.doc(chatId);
    const currentChat = (await snapshot.get()).data() as IChat;

    const containsPhone = currentChat.members.some((member) =>
      validatePhoneForE164(member)
    );

    let messagesCollection = snapshot.collection("/messages");

    const newMessage: IMessage = {
      senderId: senderId,
      message: message,
      time: Timestamp.now(),
    };

    if (containsPhone) {
      //send a message via twillio
      console.log("Send via Twillio");
    }

    messagesCollection.add(newMessage);

    successResponse(res, { newMessage });
  },
};
