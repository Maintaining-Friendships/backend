import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { successResponse } from "../middleware/responses";
import { IChat } from "../models/chatSchema";
import { IUser } from "../models/userSchema";
import chooseFriend from "../services/chooseFriend";
import { Timestamp } from "@google-cloud/firestore";

export default {
  createChat: async function (req: Request, res: Response) {
    //creates a new chat based on an algorithum in Choose Friend
    const userId = req.body.userId;
    const friendId: string = await chooseFriend(userId);
    const chatCollection = admin.firestore().collection("/chats");
    const userCollection = admin.firestore().collection("/users");

    let newChat: IChat = {
      members: [userId, friendId],
      messages: [],
    };

    const chat = await chatCollection.add(newChat);

    await updateFriend(userCollection, userId, friendId);

    return successResponse(res, {
      chat,
    });
  },
};
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
    cities: admin.firestore.FieldValue.arrayUnion(friend),
  });
}
