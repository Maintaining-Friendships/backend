"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var UserSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        default: "",
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        default: "",
        trim: true,
    },
    countryCode: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNo: {
        type: String,
        required: true,
        trim: true,
    },
    profilePicture: {
        type: String,
        default: null,
        trim: true,
    },
    friends: {
        type: [],
        default: [],
    },
});
exports.USER = mongoose_1.default.model("individual_user", UserSchema);
