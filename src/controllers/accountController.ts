import { badRequestResponse, successResponse } from "../middleware/responses";
import e, { Request, Response } from "express";
import mongoose from "mongoose";
import { IUser, USER } from "../models/userSchema";

export default {
  createAccount: async function (req: Request, res: Response) {
    const uri = process.env.MONGO_URI;

    mongoose.connect(uri);

    const user = await USER.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      countryCode: req.body.countryCode,
      phoneNo: req.body.phoneNo,
    });

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
