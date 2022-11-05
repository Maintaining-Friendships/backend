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
        .services(process.env.SERVICE_ID)
        .verifications.create({ to: phoneNumber, channel: "sms" })
        .then((verification) => (0, responses_1.successResponse)(res, { id: verification.sid }));
};
exports.sendOTP = sendOTP;
const checkOTP = (phoneNumber, oneTimeCode, res) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);
    if (!validatePhoneForE164(phoneNumber)) {
        (0, responses_1.badRequestResponse)(res, { phoneNumberFormat: false });
    }
    client.verify.v2
        .services(process.env.SERVICE_ID)
        .verificationChecks.create({ to: phoneNumber, code: oneTimeCode })
        .then((verification_check) => {
        return verification_check.valid;
    });
    return false;
};
exports.checkOTP = checkOTP;
