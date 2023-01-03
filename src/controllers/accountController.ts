import { badRequestResponse, successResponse } from "../middleware/responses";
import e, { Request, Response } from "express";
import { IUser, USER } from "../models/userSchema";
import * as admin from "firebase-admin";

// Create a new client

export default {
  createAccount: async function (req: Request, res: Response) {
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
    return successResponse(res, {
      name: "Henry Marks",
    });
  },
};
