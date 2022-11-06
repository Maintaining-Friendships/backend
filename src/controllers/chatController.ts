import { badRequestResponse, successResponse } from "../middleware/responses";
import { Request, Response } from "express";
import { sendOTP, checkOTP } from "../middleware/optVerification";
import { createJWT } from "../middleware/token";

export default {
  chooseFriend: async function (req: Request, res: Response) {
    //a function that chooses a random friend from the contacts of user

    let listOfFriends = { Andy: 1, Fern: 8, Samek: 9, Henry: 2 };

    successResponse(res, { friend: "Andy" });
  },
};
