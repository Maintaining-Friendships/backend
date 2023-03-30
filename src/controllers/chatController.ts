import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { badRequestResponse, successResponse } from "../middleware/responses";
import { IChat, IMessage } from "../models/chatSchema";
import { createChat } from "../services/chat/autoCreateChat";
import validatePhoneForE164 from "../services/validatePhone";
import { Timestamp } from "@google-cloud/firestore";
import MessagingResponse from "twilio/lib/twiml/MessagingResponse";
import { sendMessage } from "../services/chat/sendMessage";
import { IUser } from "../models/userSchema";
import { sendNotificationToUser } from "../services/chat/sendNotification";

export default {
  createChat: async function (req: Request, res: Response) {
    //creates a new chat based on an algorithum in Choose Friend
    const userId = req.body.userId;
    //creates a new chat based on an algorithum in Choose Friend
    //the friend can either be a Phone Number or a User ID
    const chat = await createChat(userId);

    return successResponse(res, chat);
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
    const newMessage: IMessage = await sendMessage(chatId, senderId, message);

    successResponse(res, { newMessage });
  },
  receiveSms: async function (req: Request, res: Response) {
    //find what chat to send this message by looking at the last message we have sent to this person!!!!
    const twiml = new MessagingResponse();

    twiml.message("The Robots are coming! Head for the hills!");

    res.type("text/xml").send(twiml.toString());
  },

  sendNotification: async function (req: Request, res: Response) {
    // sendNotificationToUser(req.body.userId, ).then((notificationId) => {
    //   if (notificationId != null) {
    //     successResponse(res, { notificationID: notificationId });
    //   }
    // });
  },
};
