"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const responses_1 = require("../middleware/responses");
exports.default = {
    openEndedQuestion: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Function that returns an open ended question for people to talk about
            let listOfQuestions = [
                "What was the most interesting thing you did today?", "Who is your hero?", "What would you change about yourself if you could?"
            ];
            let random_idx = Math.floor(Math.random() * listOfQuestions.length);
            let question = listOfQuestions[random_idx];
            return (0, responses_1.successResponse)(res, {
                question: question
            });
        });
    }
};
