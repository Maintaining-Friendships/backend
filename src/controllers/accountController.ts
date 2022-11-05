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
  getOtp: async function (req: Request, res: Response) {
    //function that sends an OTP to client
    sendOTP(req.body.phoneNumber, req, res);
  },
  verifyUser: async function (req: Request, res: Response) {
    //function that checks the validity of an OTP to verify if the client is authenticated and returns token for user
    let phoneNumber: string = req.body.phoneNumber;
    let oneTimeCode: string = req.body.oneTimeCode;

    let valid_otp: boolean = checkOTP(phoneNumber, oneTimeCode, res);

    if (valid_otp) {
      let jwt: string = createJWT(phoneNumber, oneTimeCode);
      return successResponse(res, { jwt: jwt });
    } else {
      return badRequestResponse(res, { valid_otp: valid_otp });
    }
  },
};
