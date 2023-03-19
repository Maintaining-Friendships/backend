import chooseFriend from "./chooseFriend";
import * as admin from "firebase-admin";

async function sendChatPossibility(userId: string) {
  const friend: string = await chooseFriend(userId);

  //   admin.messaging().send()
}
