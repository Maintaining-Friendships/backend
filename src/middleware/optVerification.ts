import { badRequestResponse, successResponse } from "./responses";
import { Request, Response} from "express"


const validatePhoneForE164 = (phoneNumber: string) => {
  const regEx = /^\+[1-9]\d{10,14}$/;
  return regEx.test(phoneNumber);
};

export const sendOTP = (phoneNumber: string, req: Request, res: Response,) => {
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

export const checkOTP = (phoneNumber: string, oneTimeCode: string, req: Request, res: Response,) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);

  if(!validatePhoneForE164(phoneNumber)){
    badRequestResponse(res, {phoneNumberFormat: false})
  }

  return client.verify.v2
    .services("VA48a949965915d8a674d855a900348278")
    .verificationChecks.create({to: phoneNumber, code: oneTimeCode})
    .then((verification_check: { status: any; }) => successResponse(res, {status: verification_check.status}));
};


