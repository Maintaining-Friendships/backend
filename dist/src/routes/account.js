"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const accountController_1 = __importDefault(require("../controllers/accountController"));
router.post("/create-account", function (req, res) {
    return accountController_1.default.createAccount(req, res);
});
router.get("/account-info", function (req, res) {
    return accountController_1.default.accountInfo(req, res);
});
router.post("/add-friend", function (req, res) {
    console.log("adding friend");
    return accountController_1.default.addFriend(req, res);
});
exports.default = router;
