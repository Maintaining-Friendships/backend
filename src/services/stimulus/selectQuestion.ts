import * as admin from "firebase-admin";
import { IStimulus } from "../../models/stimulusSchema";
import { Configuration, OpenAIApi } from "openai";

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

async function getOpenAi(): Promise<string> {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createCompletion({
    model: "text-curie-001",
    prompt:
      "Create an open-ended question to spark an interesting conversation",
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  if (response.data.choices[0].text) {
    return response.data.choices[0].text.replace(/(\r\n|\n|\r)/gm, "");
  } else {
    return getStimulus();
  }
}

export { getStimulus, getOpenAi };
