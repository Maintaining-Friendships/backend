import { badRequestResponse, successResponse } from "../middleware/responses";
import e, { Request, Response } from "express";
import { IFriend, IUser } from "../models/userSchema";
import * as admin from "firebase-admin";
import { Timestamp } from "@google-cloud/firestore";
import { uploadImage } from "../services/user/uploadProfile";

// Create a new client

export default {
  createAccount: async function (req: Request, res: Response) {
    //function that creates a new account for the user
    const collection = admin.firestore().collection("/users");

    let newUser: IUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNo: req.body.phoneNo,
      profilePicture: "",
      friends: [],
      lastConvo: null,
    };
    const request = await collection.add(newUser);

    let user = await request.get();

    return successResponse(res, { user: user.data(), userId: user.id });
  },

  autoLoginUser: async function (req: Request, res: Response) {
    let userId: string = req.body.id;
    const collection = admin.firestore().collection("/users");

    const snapshot = await collection.doc(userId).get();

    if (snapshot.exists) {
      return successResponse(res, { userCreated: true });
    } else {
      return badRequestResponse(res, { problem: "User not found" });
    }
  },
  uploadProfilePhoto: async function (req: Request, res: Response) {
    //send the file to the server, then upload it to the firestore database
    //implement image compression later
    const myFile: Express.Multer.File | undefined = req.file;
    const userId: string = req.body.userId;

    if (myFile != undefined) {
      try {
        const imageUrl = await uploadImage(
          myFile,
          admin.storage().bucket("profile_picture_maintaining_friendships"),
          userId
        );

        const collection = admin.firestore().collection("/users");

        await collection.doc(userId).update({
          profilePicture: imageUrl,
        });

        successResponse(res, { imageURL: imageUrl });
      } catch (error) {
        badRequestResponse(res, error);
      }
    } else {
      badRequestResponse(res, { error: "No file uploaded" });
    }

    //bucket.file()
  },
  accountInfo: async function (req: Request, res: Response) {
    //function that returns the data of the client
    let userId: string = req.params.id;
    const collection = admin.firestore().collection("/users");

    const snapshot = await collection.doc(userId).get();

    if (snapshot.exists) {
      const userData = snapshot.data();
      return successResponse(res, userData);
    } else {
      return badRequestResponse(res, { problem: "User not found" });
    }
  },

  addFriend: async function (req: Request, res: Response) {
    //function that adds a friend by their ID
    const userId = req.body.userID;
    const friendID = req.body.friendId;
    const importance = req.body.importance;
    const friendsPhone = req.body.friendsPhone;

    const document = admin.firestore().collection("/users").doc(userId);

    const friend = (
      await admin.firestore().collection("/users").doc(friendID).get()
    ).data();

    let newFriend: IFriend = {
      userID: friendID,
      importance: importance,
      lastReachedOut: Timestamp.now(),
      friendsPhone: friendsPhone,
      name: friend?.firstName ?? "",
    };

    const snapshot = await document.update({
      friends: admin.firestore.FieldValue.arrayUnion(newFriend),
    });

    return successResponse(res, { snapshot });
  },

  addFriendByPhone: async function (req: Request, res: Response) {
    //fumction that searches for friend by Phone number, if it does it associates the account with an ID if not just adds the phone NO
    const friendsPhone: string = req.body.friendsPhone;
    const individualUserId: string = req.body.individualUserId;
    const importance: number = req.body.importance;
    const friendName: string = req.body.friendName;

    const usersCollection = admin.firestore().collection("/users");
    const individualUser = usersCollection.doc(individualUserId);

    const query = usersCollection.where("phoneNo", "==", friendsPhone);

    const snapshot = await query.get();

    if (snapshot.empty) {
      let newFriend: IFriend = {
        userID: null,
        importance: importance,
        lastReachedOut: Timestamp.now(),
        friendsPhone: friendsPhone,
        name: friendName,
      };

      const createdFriend = await individualUser.update({
        friends: admin.firestore.FieldValue.arrayUnion(newFriend),
      });
      return successResponse(res, { createdFriend });
    } else {
      const friendAccountID: string = snapshot.docs[0].id;

      let newFriend: IFriend = {
        userID: friendAccountID,
        importance: importance,
        lastReachedOut: Timestamp.now(),
        friendsPhone: friendsPhone,
        name: friendName,
      };
      const createdFriend = await individualUser.update({
        friends: admin.firestore.FieldValue.arrayUnion(newFriend),
      });
      return successResponse(res, { createdFriend });
    }
  },
};

interface ImageReq extends Request {
  file: any;
}
