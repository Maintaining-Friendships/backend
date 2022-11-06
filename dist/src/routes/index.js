"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
const account_1 = __importDefault(require("./account"));
const stimulus_1 = __importDefault(require("./stimulus"));
const auth_routes_1 = __importDefault(require("./auth_routes"));
const chat_1 = __importDefault(require("./chat"));
router.use("/auth", auth_routes_1.default);
router.use("/account", auth_1.default, account_1.default);
router.use("/stimulus", auth_1.default, stimulus_1.default);
router.use("/chat", chat_1.default);
exports.default = router;
