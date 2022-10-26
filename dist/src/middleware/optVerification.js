"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOTP = exports.sendOTP = void 0;
const responses_1 = require("./responses");
const validatePhoneForE164 = (phoneNumber) => {
    const regEx = /^\+[1-9]\d{10,14}$/;
    return regEx.test(phoneNumber);
};
const sendOTP = (phoneNumber, req, res) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);
    if (!validatePhoneForE164(phoneNumber)) {
        (0, responses_1.badRequestResponse)(res, { phoneNumberFormat: false });
    }
    return client.verify.v2
        .services("VA48a949965915d8a674d855a900348278")
        .verifications.create({ to: phoneNumber, channel: "sms" })
        .then((verification) => (0, responses_1.successResponse)(res, { id: verification.sid }));
};
exports.sendOTP = sendOTP;
const checkOTP = (phoneNumber, oneTimeCode, req, res) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);
    if (!validatePhoneForE164(phoneNumber)) {
        (0, responses_1.badRequestResponse)(res, { phoneNumberFormat: false });
    }
    return client.verify.v2
        .services("VA48a949965915d8a674d855a900348278")
        .verificationChecks.create({ to: phoneNumber, code: oneTimeCode })
        .then((verification_check) => (0, responses_1.successResponse)(res, { status: verification_check.status }));
};
exports.checkOTP = checkOTP;
