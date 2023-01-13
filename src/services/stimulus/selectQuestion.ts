import * as admin from "firebase-admin";
import { IStimulus } from "../../models/stimulusSchema";

async function getStimulus(): Promise<string> {
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

  let randomQuestion = randomDoc.docs[0].data() as IStimulus;
  return randomQuestion.textBased;
}

export { getStimulus };
