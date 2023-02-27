import validatePhoneForE164 from "../validatePhone";
import * as admin from "firebase-admin";
import { IChat, IMessage } from "../../models/chatSchema";
import { Timestamp } from "@google-cloud/firestore";

async function sendMessage(chatId: string, senderId: string, message: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const companyPhone = process.env.COMPANY_PHONE;

  const client = require("twilio")(accountSid, authToken);

  const chatsRef = admin.firestore().collection("/chats");
  const snapshot = chatsRef.doc(chatId);
  const currentChat = (await snapshot.get()).data() as IChat;

  const phoneNumber = currentChat.members.find((member: string) => {
    const phone = validatePhoneForE164(member);
    if (phone) {
      return phone;
    }
  });

  let messagesCollection = snapshot.collection("/messages");

  const newMessage: IMessage = {
    senderId: senderId,
    message: message,
    time: Timestamp.now(),
  };

  if (phoneNumber) {
    //send a message via twillio
    console.log("Send via Twillio");
    console.log(phoneNumber);
    client.messages
      .create({
        body: message,
        from: companyPhone,
        to: phoneNumber,
      })
      .then((message: { sid: any }) =>
        console.log("message ID: " + message.sid)
      );
  }

  messagesCollection.add(newMessage);
  return newMessage;
}

export { sendMessage };
