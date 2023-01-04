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
const responses_1 = require("../middleware/responses");
const admin = __importStar(require("firebase-admin"));
const firestore_1 = require("@google-cloud/firestore");
// Create a new client
exports.default = {
    createAccount: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //function that creates a new account for the user
            const collection = admin.firestore().collection("/users");
            let newUser = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNo: req.body.phoneNo,
                countryCode: req.body.countryCode,
                profilePicture: req.body.profilePicture,
                friends: [],
            };
            const user = yield collection.add(newUser);
            return (0, responses_1.successResponse)(res, {
                user,
            });
        });
    },
    accountInfo: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //function that returns the data of the client
            const collection = admin.firestore().collection("/users");
            const snapshot = yield collection.doc(req.body.id).get();
            if (snapshot.exists) {
                const userData = snapshot.data();
                return (0, responses_1.successResponse)(res, { userData });
            }
            else {
                return (0, responses_1.badRequestResponse)(res, "User not found");
            }
        });
    },
    addFriend: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //function that adds a friend by their ID
            const document = admin
                .firestore()
                .collection("/users")
                .doc(req.body.userId);
            let newFriend = {
                userID: req.body.friendId,
                importance: req.body.importance,
                lastReachedOut: firestore_1.Timestamp.now(),
            };
            const snapshot = yield document.update({
                friends: admin.firestore.FieldValue.arrayUnion(newFriend),
            });
            return (0, responses_1.successResponse)(res, { snapshot });
        });
    },
};
