import { badRequestResponse, successResponse } from "../middleware/responses";
import e, { Request, Response } from "express";
import { sendOTP, checkOTP } from "../middleware/optVerification";
import { createJWT } from "../middleware/token";

export default {
  accountInfo: async function (req: Request, res: Response) {
    //function that returns the data of the client
    return successResponse(res, {
      name: "Henry Marks",
    });
  },
};
