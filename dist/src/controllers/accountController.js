"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const responses_1 = require("../middleware/responses");
const optVerification_1 = require("../middleware/optVerification");
const token_1 = require("../middleware/token");
exports.default = {
    accountInfo: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //function that returns the data of the client
            return (0, responses_1.successResponse)(res, {
                name: "Henry Marks",
            });
        });
    },
    getOtp: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //function that sends an OTP to client
            (0, optVerification_1.sendOTP)(req.body.phoneNumber, req, res);
        });
    },
    verifyUser: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //function that checks the validity of an OTP to verify if the client is authenticated and returns token for user
            let phoneNumber = req.body.phoneNumber;
            let oneTimeCode = req.body.oneTimeCode;
            let valid_otp = (0, optVerification_1.checkOTP)(phoneNumber, oneTimeCode, res);
            if (valid_otp) {
                let jwt = (0, token_1.createJWT)(phoneNumber, oneTimeCode);
                return (0, responses_1.successResponse)(res, { jwt: jwt });
            }
            else {
                return (0, responses_1.badRequestResponse)(res, { valid_otp: valid_otp });
            }
        });
    },
};
