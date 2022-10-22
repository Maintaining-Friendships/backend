"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const stimulusController_1 = __importDefault(require("../controllers/stimulusController"));
router.get('/open-ended-question', function (req, res) {
    return stimulusController_1.default.openEndedQuestion(req, res);
});
exports.default = router;
