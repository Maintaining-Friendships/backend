"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.createJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responses_1 = require("./responses");
const createJWT = (phoneNumber, otpCode) => {
    let token = jsonwebtoken_1.default.sign({ phoneNumber: phoneNumber, otpCode: otpCode }, process.env.JWT_CODE, {
        expiresIn: "10 days", // expires in 356 days
    });
    return token;
};
exports.createJWT = createJWT;
const verifyJWT = (token, res, next) => {
    //Check if the JWT is valid, if it is valid, allow the auth to continue
    jsonwebtoken_1.default.verify(token, process.env.JWT_CODE, function (err, decoded) {
        if (err) {
            return (0, responses_1.badRequestResponse)(res, { error: err });
        }
        res.json({
            success: true,
            decoded: decoded,
        });
        return next();
    });
};
exports.verifyJWT = verifyJWT;
