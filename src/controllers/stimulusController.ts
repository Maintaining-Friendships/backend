import { successResponse } from "../middleware/responses";
import { Request, Response } from "express";
import * as admin from "firebase-admin";

export default {
  openEndedQuestion: async function (req: Request, res: Response) {
    //Function that returns an open ended question for people to talk about
    const collection = admin.firestore().collection("/stimulus");

    const random = Math.random();

    let randomDoc = collection.orderBy(
      admin.firestore.FieldPath.documentId(),
      random > 0.5 ? "asc" : "desc"
    );

    randomDoc = randomDoc.limit(1);

    const snapshot = await randomDoc.get();
    const documents = snapshot.docs;

    if (documents.length > 0) {
      const randomDocument = documents[0];
      const documentData = randomDocument.data();
      return successResponse(res, {
        documentData,
      });
    }
  },
};
