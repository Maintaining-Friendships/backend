import { badRequestResponse, successResponse } from "./responses";
import { Request, Response} from "express"

const validatePhoneForE164 = (phoneNumber: string) => {
  const regEx = /^\+[1-9]\d{10,14}$/;
  return regEx.test(phoneNumber);
};

export const optVerification = (phoneNumber: string, req: Request, res: Response,) => {
  // Find your Account SID and Auth Token at twilio.com/console
  // and set the environment variables. See http://twil.io/secure
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);

  if(!validatePhoneForE164(phoneNumber)){
    badRequestResponse(res, {phoneNumberFormat: false})
  }

  return client.verify.v2
    .services("VA48a949965915d8a674d855a900348278")
    .verifications.create({ to: phoneNumber, channel: "sms" })
    .then((verification: { sid: any }) => successResponse(res, {id: verification.sid}));
};
