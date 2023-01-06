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
exports.default = {
    openEndedQuestion: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Function that returns an open ended question for people to talk about
            // Get a reference to the "items" collection
            const itemsRef = admin.firestore().collection("/stimulus");
            // Get a random number between 1 and the total number of documents in the collection
            const totalDocs = yield itemsRef
                .select(admin.firestore.FieldPath.documentId())
                .get();
            const numDocs = totalDocs.docs.length;
            const randomNum = Math.floor(Math.random() * numDocs);
            // Retrieve a single document from the collection, using the random number as the offset
            const randomDoc = yield itemsRef
                .orderBy(admin.firestore.FieldPath.documentId())
                .offset(randomNum)
                .limit(1)
                .get();
            // Print the random document
            if (randomDoc.docs[0].exists) {
                let randomQuestion = randomDoc.docs[0].data();
                (0, responses_1.successResponse)(res, { randomQuestion });
            }
            else {
                (0, responses_1.notFoundResponse)(res);
            }
        });
    },
};
