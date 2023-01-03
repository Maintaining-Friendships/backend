import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { IChat } from "../models/chatSchema";
import { IUser } from "../models/userSchema";

const chooseFriend = async (userId: string): Promise<string> => {
  //for each friend, find the length of time since last reached out, then find the importance of the relationship
  let reachOutTo: string = "";
  let currentHighestPts = 0;

  const collection = admin.firestore().collection("/users");
  const snapshot = await collection.doc(userId).get();

  let userData: IUser = snapshot.data() as IUser;

  const userFriends = userData.friends;

  userFriends.forEach((friend) => {
    let friendPoints = friend.importance;
    const lastReachedOut = friend.lastReachedOut;

    if (lastReachedOut == null) {
      friendPoints += 10;
    } else {
      const today = new Date();

      const todayTimestamp = today.getTime();
      const otherTimestamp = lastReachedOut.getTime();

      const diff = otherTimestamp - todayTimestamp;

      const days = diff / 86400000;

      friendPoints += calculateTimePoints(days);
    }

    if (friendPoints >= currentHighestPts) {
      currentHighestPts = friendPoints;
      reachOutTo = friend.userID;
    }
  });

  return reachOutTo;
};

function calculateTimePoints(days: number) {
  let points = Math.pow(days, 2);
  points = points / 90;

  if (points > 10) {
    points = 10;
  }
  return points;
}

export default chooseFriend;
