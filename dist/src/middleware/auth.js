"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ensureAuthorized = (req, res, next) => {
    return next();
};
exports.default = ensureAuthorized;
