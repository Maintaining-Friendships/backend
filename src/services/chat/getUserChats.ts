import * as admin from "firebase-admin";
import { IChat, IMessage } from "../../models/chatSchema";
import { IUser } from "../../models/userSchema";

const getUserChats = async (userId: string) => {
  let chats = admin.firestore().collection("/chats");
  const userCollection = admin.firestore().collection("/users");

  let userChats = await chats.where("members", "array-contains", userId).get();
  let createdChats: any[] = [];

  for (const chat of userChats.docs) {
    let chatInfo = chat.data() as IChat;
    let messages = (
      await chats.doc(chat.id).collection("/messages").get()
    ).docs.map((message) => message.data() as IMessage);

    const friendId = chatInfo.members.find((memeber) => memeber != userId);

    let user = (await userCollection.doc(userId).get()).data() as IUser;

    let friendData = user.friends.find(
      (element) =>
        element.userID == friendId || element.friendsPhone == friendId
    );

    createdChats.push({
      friend: friendData,
      stimulus: chatInfo.stimulus,
      chatId: chat.id,
      messages: messages,
    });
  }

  return createdChats;
};

export default getUserChats;
