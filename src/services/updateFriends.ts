import * as admin from "firebase-admin";
import { IUser } from "../models/userSchema";
import { Timestamp } from "@google-cloud/firestore";

//attempt to paramerterize these two functions in the future
async function updateFriendID(
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

async function updateFriendPhoneNo(
  userCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData>,
  userId: string,
  friendPhone: string
) {
  const user = (await userCollection.doc(userId).get()).data() as IUser;

  let friend = user.friends.filter(
    (friend) => friend.friendsPhone == friendPhone
  )[0];

  await userCollection.doc(userId).update({
    friends: admin.firestore.FieldValue.arrayRemove(friend),
  });

  friend.lastReachedOut = Timestamp.now();

  await userCollection.doc(userId).update({
    friends: admin.firestore.FieldValue.arrayUnion(friend),
  });
}

export { updateFriendID, updateFriendPhoneNo };
