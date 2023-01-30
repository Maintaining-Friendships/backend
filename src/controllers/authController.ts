import { badRequestResponse, successResponse } from "../middleware/responses";
import e, { Request, Response } from "express";
import { sendOTP, checkOTP } from "../middleware/optVerification";
import { createJWT } from "../middleware/token";
import { getUserByPhone } from "../services/stimulus/getUserByPhone";

export default {
  getOtp: async function (req: Request, res: Response) {
    //function that sends an OTP to client
    sendOTP(req.body.phoneNumber, req, res);
  },
  verifyUser: async function (req: Request, res: Response) {
    //function that checks the validity of an OTP to verify if the client is authenticated and returns token for user
    let phoneNumber: string = req.body.phoneNumber;
    let oneTimeCode: string = req.body.oneTimeCode;

    let valid_otp = await checkOTP(phoneNumber, oneTimeCode, res);

    console.log("is this a valid OTP", valid_otp);

    if (valid_otp) {
      //check if the User is in the DB by querying for Phone No.
      let userId: string = await getUserByPhone(phoneNumber);
      let jwt: string = createJWT(phoneNumber, oneTimeCode);

      return successResponse(res, { jwt: jwt, userId: userId });
    } else {
      return badRequestResponse(res, { valid_otp: valid_otp });
    }
  },
};
