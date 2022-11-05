"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const accountController_1 = __importDefault(require("../controllers/accountController"));
router.post("/get-otp", function (req, res) {
    console.log("get otp");
    return accountController_1.default.getOtp(req, res);
});
router.post("/verify-otp", function (req, res) {
    console.log("verify otp");
    accountController_1.default.verifyUser(req, res);
});
exports.default = router;
