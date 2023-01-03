"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const admin = __importStar(require("firebase-admin"));
const chooseFriend = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    //for each friend, find the length of time since last reached out, then find the importance of the relationship
    let reachOutTo = "";
    let currentHighestPts = 0;
    const collection = admin.firestore().collection("/users");
    const snapshot = yield collection.doc(userId).get();
    let userData = snapshot.data();
    const userFriends = userData.friends;
    userFriends.forEach((friend) => {
        let friendPoints = friend.importance;
        const lastReachedOut = friend.lastReachedOut;
        if (lastReachedOut == null) {
            friendPoints += 10;
        }
        else {
            const today = new Date();
            const todayTimestamp = today.getTime();
            const otherTimestamp = lastReachedOut.getTime();
            const diff = otherTimestamp - todayTimestamp;
            const days = diff / 86400000;
            friendPoints += calculateTimePoints(days);
        }
        if (friendPoints >= currentHighestPts) {
            currentHighestPts = friendPoints;
            reachOutTo = friend.userID;
        }
    });
    return reachOutTo;
});
function calculateTimePoints(days) {
    let points = Math.pow(days, 2);
    points = points / 90;
    if (points > 10) {
        points = 10;
    }
    return points;
}
exports.default = chooseFriend;
