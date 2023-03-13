import chooseFriend from "./chooseFriend";
import validatePhoneForE164 from "../validatePhone";
import * as admin from "firebase-admin";
import { Timestamp } from "@google-cloud/firestore";
import { IChat, IMessage } from "../../models/chatSchema";
import { updateFriendID, updateFriendPhoneNo } from "../user/updateFriends";
import { getStimulus } from "../stimulus/selectQuestion";
import { checkChatOverlap } from "./checkChatOverlap";

async function createChat(userId: string) {
  //creates a new chat based on an algorithum in Choose Friend
  //the friend can either be a Phone Number or a User ID
  const friend: string = await chooseFriend(userId);
  const chatCollection = admin.firestore().collection("/chats");
  const userCollection = admin.firestore().collection("/users");
  const stimulus: string = await getStimulus();

  const sharedChatIds = await checkChatOverlap(chatCollection, userId, friend);

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

  if (sharedChatIds.length != 0) {
    const existingChatId = sharedChatIds[0];
    // Update the existing chat with the new stimulus
    await chatCollection.doc(existingChatId).update({ stimulus: stimulus });
    let stimulusChat: IMessage = {
      senderId: "adminBot",
      message: stimulus,
      time: Timestamp.now(),
    };
    chatCollection
      .doc(existingChatId)
      .collection("/messages")
      .add(stimulusChat);
    let finalChat = (await chatCollection.doc(existingChatId).get()).data();

    if (finalChat != undefined) {
      finalChat["chatId"] = finalChat.id;
    }

    return finalChat;
  } else {
    let newChat: IChat = {
      members: [userId, friend],
      stimulus: stimulus,
    };

    let chat = await chatCollection.add(newChat);

    let stimulusChat: IMessage = {
      senderId: "adminBot",
      message: stimulus,
      time: Timestamp.now(),
    };
    chatCollection.doc(chat.id).collection("/messages").add(stimulusChat);
    let finalChat = (await chatCollection.doc(chat.id).get()).data();
    if (finalChat != undefined) {
      finalChat["chatId"] = chat.id;
    }
    return finalChat;
  }
}

export { createChat };
