import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { successResponse } from "../middleware/responses";
import { IChat } from "../models/chatSchema";
import { IUser } from "../models/userSchema";
import chooseFriend from "../services/chooseFriend";
import { Timestamp } from "@google-cloud/firestore";
import validatePhoneForE164 from "../services/validatePhone";

export default {
  createChat: async function (req: Request, res: Response) {
    //creates a new chat based on an algorithum in Choose Friend
    const userId = req.body.userId;
    //creates a new chat based on an algorithum in Choose Friend
    //the friend can either be a Phone Number or a User ID
    const friend: string = await chooseFriend(userId);
    if (validatePhoneForE164(friend)) {
      //the user only has a phone Number
    } else {
      //this means the value is a User ID
      const chatCollection = admin.firestore().collection("/chats");
      const userCollection = admin.firestore().collection("/users");

      let newChat: IChat = {
        members: [userId, friend],
        messages: [],
      };

      const chat = await chatCollection.add(newChat);

      await updateFriend(userCollection, userId, friend);
      await userCollection.doc(userId).update({
        lastConvo: Timestamp.now(),
      });

      return successResponse(res, {
        chat,
      });
    }
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
async function autoCreateChat(userId: string) {
  //creates a new chat based on an algorithum in Choose Friend
  //the friend can either be a Phone Number or a User ID
  const friend: string = await chooseFriend(userId);
  if (validatePhoneForE164(friend)) {
    //the user only has a phone Number
  } else {
    //this means the value is a User ID
    const chatCollection = admin.firestore().collection("/chats");
    const userCollection = admin.firestore().collection("/users");

    let newChat: IChat = {
      members: [userId, friend],
      messages: [],
    };

    await chatCollection.add(newChat);

    await updateFriend(userCollection, userId, friend);
    await userCollection.doc(userId).update({
      lastConvo: Timestamp.now(),
    });
  }
}

async function updateFriend(
  userCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData>,
  userId: any,
  friendId: string
) {
  const user = (await userCollection.doc(userId).get()).data() as IUser;

  let friend = user.friends.filter((friend) => friend.userID == friendId)[0];

  await userCollection.doc(userId).update({
    friends: admin.firestore.FieldValue.arrayRemove(friend),
  });

  friend.lastReachedOut = Timestamp.now();

  await userCollection.doc(userId).update({
    friends: admin.firestore.FieldValue.arrayUnion(friend),
  });
}
