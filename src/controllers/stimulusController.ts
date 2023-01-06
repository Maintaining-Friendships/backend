import { notFoundResponse, successResponse } from "../middleware/responses";
import { Request, Response } from "express";
import * as admin from "firebase-admin";

export default {
  openEndedQuestion: async function (req: Request, res: Response) {
    //Function that returns an open ended question for people to talk about
    // Get a reference to the "items" collection
    const itemsRef = admin.firestore().collection("/stimulus");

    // Get a random number between 1 and the total number of documents in the collection
    const totalDocs = await itemsRef
      .select(admin.firestore.FieldPath.documentId())
      .get();

    const numDocs = totalDocs.docs.length;
    const randomNum = Math.floor(Math.random() * numDocs);

    // Retrieve a single document from the collection, using the random number as the offset
    const randomDoc = await itemsRef
      .orderBy(admin.firestore.FieldPath.documentId())
      .offset(randomNum)
      .limit(1)
      .get();

    // Print the random document
    if (randomDoc.docs[0].exists) {
      let randomQuestion = randomDoc.docs[0].data();
      successResponse(res, { randomQuestion });
    } else {
      notFoundResponse(res);
    }
  },
};
