"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const chatController_1 = __importDefault(require("../controllers/chatController"));
router.post("/create-chat", function (req, res) {
    return chatController_1.default.createChat(req, res);
});
router.post("/create-chat-cron", function (req, res) {
    return chatController_1.default.createChatCron(req, res);
});
exports.default = router;
