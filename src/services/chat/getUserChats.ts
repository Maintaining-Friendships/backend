import * as admin from "firebase-admin";
import { IMessage } from "../../models/chatSchema";
import { IUser } from "../../models/userSchema";

const getUserChats = async (userId: string) => {
  let chats = admin.firestore().collection("/chats");
  let userChats = await chats.where("members", "array-contains", userId).get();
  let createdChats: any[] = [];

  for (const chat of userChats.docs) {
    let chatData = chat.data();
    let messages = (
      await chats.doc(chat.id).collection("/messages").get()
    ).docs.map((message) => message.data() as IMessage);
    if (chatData) {
      chatData["messages"] = messages;
      chatData["chatId"] = chat.id;

      createdChats.push(chatData);
      console.log(createdChats);
    }
  }

  return createdChats;
};

export default getUserChats;
