import { badRequestResponse, successResponse } from "../middleware/responses";
import e, { Request, Response } from "express";
import { IFriend, IUser } from "../models/userSchema";
import * as admin from "firebase-admin";
import { Timestamp } from "@google-cloud/firestore";

// Create a new client

export default {
  createAccount: async function (req: Request, res: Response) {
    //function that creates a new account for the user
    const collection = admin.firestore().collection("/users");

    let newUser: IUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNo: req.body.phoneNo,
      countryCode: req.body.countryCode,
      profilePicture: req.body.profilePicture,
      friends: [],
      lastConvo: null,
    };
    const user = await collection.add(newUser);

    return successResponse(res, {
      user,
    });
  },
  accountInfo: async function (req: Request, res: Response) {
    //function that returns the data of the client
    const collection = admin.firestore().collection("/users");

    const snapshot = await collection.doc(req.body.id).get();

    if (snapshot.exists) {
      const userData = snapshot.data();
      return successResponse(res, { userData });
    } else {
      return badRequestResponse(res, "User not found");
    }
  },

  addFriend: async function (req: Request, res: Response) {
    //function that adds a friend by their ID
    const document = admin
      .firestore()
      .collection("/users")
      .doc(req.body.userId);

    let newFriend: IFriend = {
      userID: req.body.friendId,
      importance: req.body.importance,
      lastReachedOut: Timestamp.now(),
      friendsPhone: req.body.friendsPhone,
    };

    const snapshot = await document.update({
      friends: admin.firestore.FieldValue.arrayUnion(newFriend),
    });

    return successResponse(res, { snapshot });
  },

  addFriendByPhone: async function (req: Request, res: Response) {
    //fumction that searches for friend by Phone number, if it does it associates the account with an ID if not just adds the phone NO
    const friendsPhone: string = req.body.friendPhone;
    const individualUserId: string = req.body.userId;
    const importance: number = req.body.importance;

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
      };
      const createdFriend = await individualUser.update({
        friends: admin.firestore.FieldValue.arrayUnion(newFriend),
      });
      return successResponse(res, { createdFriend });
    }
  },
};
