import e from "express";
import * as admin from "firebase-admin";

async function checkChatOverlap(
  chatCollection: admin.firestore.CollectionReference<admin.firestore.DocumentData>,
  userId: string,
  friend: string
) {
  const userChats = await chatCollection
    .where("members", "array-contains", userId)
    .get();

  const friendChats = await chatCollection
    .where("members", "array-contains", friend)
    .get();

  const userChatIds = userChats.docs.map((chat) => chat.id);
  const friendChatIds = friendChats.docs.map((chat) => chat.id);

  const sharedChatIds = userChatIds.filter((id) => friendChatIds.includes(id));
  return sharedChatIds;
}

export { checkChatOverlap };
