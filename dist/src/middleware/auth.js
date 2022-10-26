"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { optVerification } from "./optVerification";
const ensureAuthorized = (req, res, next) => {
    console.log("phone number", req.body.phoneNumber);
    //optVerification(req.body.phoneNumber, req, res);
    return next();
};
exports.default = ensureAuthorized;
