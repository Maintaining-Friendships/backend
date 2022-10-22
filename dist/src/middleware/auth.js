"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ensureAuthorized = (req, res, next) => {
    console.log("check if user is authorized");
    return next();
};
exports.default = ensureAuthorized;
