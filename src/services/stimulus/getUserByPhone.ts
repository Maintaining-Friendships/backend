import * as admin from "firebase-admin";

async function getUserByPhone(phoneNumber: string): Promise<string> {
  const usersRef = admin.firestore().collection("/users");
  const snapshot = await usersRef.where("phoneNo", "==", phoneNumber).get();

  if (snapshot.empty) {
    return "";
  } else {
    return snapshot.docs[0].id;
  }
}

export { getUserByPhone };
