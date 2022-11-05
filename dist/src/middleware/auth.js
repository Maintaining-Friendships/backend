"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responses_1 = require("./responses");
const token_1 = require("./token");
// import { optVerification } from "./optVerification";
const ensureAuthorized = (req, res, next) => {
    let authToken = req.headers["authorization"];
    if (authToken != undefined) {
        (0, token_1.verifyJWT)(authToken, res, next);
    }
    else {
        (0, responses_1.badRequestResponse)(res, {
            error: "please get a new auth token via OTP, or provide your token in the header",
        });
    }
};
exports.default = ensureAuthorized;
