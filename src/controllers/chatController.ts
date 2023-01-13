import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { successResponse } from "../middleware/responses";
import { IChat } from "../models/chatSchema";
import chooseFriend from "../services/chooseFriend";
import { Timestamp } from "@google-cloud/firestore";
import validatePhoneForE164 from "../services/validatePhone";
import { updateFriendID, updateFriendPhoneNo } from "../services/updateFriends";
import { autoCreateChat } from "../services/autoCreateChat";

export default {
  createChat: async function (req: Request, res: Response) {
    //creates a new chat based on an algorithum in Choose Friend
    const userId = req.body.userId;
    //creates a new chat based on an algorithum in Choose Friend
    //the friend can either be a Phone Number or a User ID
    const friend: string = await chooseFriend(userId);

    const chatCollection = admin.firestore().collection("/chats");
    const userCollection = admin.firestore().collection("/users");

    let newChat: IChat = {
      members: [userId, friend],
      messages: [],
    };

    const chat = await chatCollection.add(newChat);

    await userCollection.doc(userId).update({
      lastConvo: Timestamp.now(),
    });

    if (validatePhoneForE164(friend)) {
      //the user only has a phone Number
      updateFriendPhoneNo(userCollection, userId, friend);
    } else {
      //this means the value is a User ID

      await updateFriendID(userCollection, userId, friend);
    }

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

    userIds.forEach(async (userId: string) => await autoCreateChat(userId));
    successResponse(res, { ...userIds.entries });
  },
};
