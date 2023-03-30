import * as admin from "firebase-admin";
import { MessagingDevicesResponse } from "firebase-admin/lib/messaging/messaging-api";
import { IUser } from "../../models/userSchema";

async function sendNotificationToUser(
  userId: string
): Promise<string | undefined> {
  const usersCollection = admin.firestore().collection("/users");
  const individualUser = (
    await usersCollection.doc(userId).get()
  ).data() as IUser;
  var payload = {
    notification: {
      title: "Time to reach out!",
      body: "Its been 20 days since you have talked to Esteban!",
    },
  };

  if (individualUser.fcmToken != undefined) {
    let response: MessagingDevicesResponse = await admin
      .messaging()
      .sendToDevice(individualUser.fcmToken, payload);

    return response.results[0].messageId;
  } else {
    return undefined;
  }
}

export { sendNotificationToUser };
