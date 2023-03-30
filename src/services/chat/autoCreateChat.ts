import chooseFriend from "./chooseFriend";
import validatePhoneForE164 from "../validatePhone";
import * as admin from "firebase-admin";
import { Timestamp } from "@google-cloud/firestore";
import { IChat, IMessage } from "../../models/chatSchema";
import { updateFriendID, updateFriendPhoneNo } from "../user/updateFriends";
import { getOpenAi, getStimulus } from "../stimulus/selectQuestion";
import { checkChatOverlap } from "./checkChatOverlap";
import { IFriend, IUser } from "../../models/userSchema";
import { sendNotificationToUser } from "./sendNotification";

async function createChat(userId: string) {
  //creates a new chat based on an algorithum in Choose Friend
  //the friend can either be a Phone Number or a User ID
  const friend: string = await chooseFriend(userId);
  const chatCollection = admin.firestore().collection("/chats");
  const userCollection = admin.firestore().collection("/users");
  const prompts: string[] = await getOpenAi();
  const sharedChatIds = await checkChatOverlap(chatCollection, userId, friend);
  let chatId = "";

  if (sharedChatIds.length != 0) {
    const existingChatId = sharedChatIds[0];
    // Update the existing chat with the new prompts
    await chatCollection.doc(existingChatId).update({ prompts: prompts });
    // let stimulusChat: IMessage = {
    //   senderId: "adminBot",
    //   message: prompts.toString(),
    //   time: Timestamp.now(),
    // };
    // chatCollection
    //   .doc(existingChatId)
    //   .collection("/messages")
    //   .add(stimulusChat);
    chatId = existingChatId;
  } else {
    let newChat: IChat = {
      members: [userId, friend],
      prompts: prompts,
    };

    let chat = await chatCollection.add(newChat);

    // let stimulusChat: IMessage = {
    //   senderId: "adminBot",
    //   message: prompts.toString(),
    //   time: Timestamp.now(),
    // };
    // chatCollection.doc(chat.id).collection("/messages").add(stimulusChat);
    chatId = chat.id;
  }
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

  let user = (await userCollection.doc(userId).get()).data() as IUser;

  let friendInfo = user.friends.find(
    (element) => element.userID == friend || element.friendsPhone == friend
  );

  await sendNotificationToUser(userId, friendInfo as IFriend);

  return {
    friend: friendInfo,
    chatId: chatId,
    stimulus: prompts,
  };
}

export { createChat };
