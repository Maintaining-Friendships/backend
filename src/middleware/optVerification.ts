import { badRequestResponse, successResponse } from "./responses";
import { Request, Response } from "express";

const validatePhoneForE164 = (phoneNumber: string) => {
  const regEx = /^\+[1-9]\d{10,14}$/;
  return regEx.test(phoneNumber);
};

export const sendOTP = (phoneNumber: string, req: Request, res: Response) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);

  if (!validatePhoneForE164(phoneNumber)) {
    badRequestResponse(res, { phoneNumberFormat: false });
  }

  return client.verify.v2
    .services(process.env.SERVICE_ID)
    .verifications.create({ to: phoneNumber, channel: "sms" })
    .then((verification: { sid: any }) =>
      successResponse(res, { id: verification.sid })
    );
};

export const checkOTP = (
  phoneNumber: string,
  oneTimeCode: string,
  res: Response
): Promise<boolean> => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);

  if (!validatePhoneForE164(phoneNumber)) {
    badRequestResponse(res, { phoneNumberFormat: false });
  }

  return client.verify.v2
    .services(process.env.SERVICE_ID)
    .verificationChecks.create({ to: phoneNumber, code: oneTimeCode })
    .then(
      (verification_check: { status: string; valid: boolean }) =>
        verification_check.valid
    );
};
