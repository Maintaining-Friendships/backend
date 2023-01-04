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
    };

    const snapshot = await document.update({
      friends: admin.firestore.FieldValue.arrayUnion(newFriend),
    });

    return successResponse(res, { snapshot });
  },
};
