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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
const responses_1 = require("../middleware/responses");
const chooseFriend_1 = __importDefault(require("../services/chooseFriend"));
const firestore_1 = require("@google-cloud/firestore");
exports.default = {
    createChat: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //creates a new chat based on an algorithum in Choose Friend
            const userId = req.body.userId;
            const friendId = yield (0, chooseFriend_1.default)(userId);
            const chatCollection = admin.firestore().collection("/chats");
            const userCollection = admin.firestore().collection("/users");
            let newChat = {
                members: [userId, friendId],
                messages: [],
            };
            const chat = yield chatCollection.add(newChat);
            yield updateFriend(userCollection, userId, friendId);
            return (0, responses_1.successResponse)(res, {
                chat,
            });
        });
    },
    createChatCron: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usersRef = admin.firestore().collection("/users");
            let userIds = new Set();
            // Get the current time
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            // Define the query
            const convoNull = usersRef.where("lastConvo", "==", null);
            const dateBefore = usersRef.where("lastConvo", "<", admin.firestore.Timestamp.fromDate(threeDaysAgo));
            yield convoNull.get().then((snapshot) => {
                snapshot.forEach((doc) => {
                    userIds.add(doc.id);
                });
            });
            yield dateBefore.get().then((snapshot) => {
                snapshot.forEach((doc) => {
                    userIds.add(doc.id);
                });
            });
            userIds.forEach((userId) => __awaiter(this, void 0, void 0, function* () { return yield autoCreateChat(userId); }));
            (0, responses_1.successResponse)(res, Object.assign({}, userIds.entries));
        });
    },
};
function autoCreateChat(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        //creates a new chat based on an algorithum in Choose Friend
        const friendId = yield (0, chooseFriend_1.default)(userId);
        const chatCollection = admin.firestore().collection("/chats");
        const userCollection = admin.firestore().collection("/users");
        let newChat = {
            members: [userId, friendId],
            messages: [],
        };
        const chat = yield chatCollection.add(newChat);
        yield updateFriend(userCollection, userId, friendId);
        yield userCollection.doc(userId).update({
            lastConvo: firestore_1.Timestamp.now(),
        });
    });
}
function updateFriend(userCollection, userId, friendId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = (yield userCollection.doc(userId).get()).data();
        let friend = user.friends.filter((friend) => friend.userID == friendId)[0];
        yield userCollection.doc(userId).update({
            friends: admin.firestore.FieldValue.arrayRemove(friend),
        });
        friend.lastReachedOut = firestore_1.Timestamp.now();
        yield userCollection.doc(userId).update({
            friends: admin.firestore.FieldValue.arrayUnion(friend),
        });
    });
}
