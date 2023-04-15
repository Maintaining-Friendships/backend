import * as admin from "firebase-admin";
import { MessagingDevicesResponse } from "firebase-admin/lib/messaging/messaging-api";
import { IFriend, IUser } from "../../models/userSchema";

async function sendNotificationToUser(
  userId: string,
  friend: IFriend
): Promise<string | undefined> {
  const usersCollection = admin.firestore().collection("/users");
  const individualUser = (
    await usersCollection.doc(userId).get()
  ).data() as IUser;

  if (friend.lastReachedOut?.toDate().getTime()) {
    const differenceInMilliseconds: number =
      Date.now() - friend.lastReachedOut?.toDate().getTime();
    const differenceInDays: number = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );

    var payload: admin.messaging.MessagingPayload = {
      notification: {
        title: "Time to reach out!",
        body: `Its been ${differenceInDays} days since you have talked to ${friend.name}`,
      },
      data: {
        friendId: friend.userID || "",
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
}

export { sendNotificationToUser };
