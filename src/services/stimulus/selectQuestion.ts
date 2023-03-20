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

async function getOpenAi(): Promise<string[]> {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt:
      "Generate 2 casual cold open conversation starters for a text conversation with an acquaintance. \n\nDesired format: An array of two prompts separated by three colons, always start each prompt with a greeting\nPrompt 1, Prompt 2\n\n\nExample:\nHey! How have you been:::  Hi, have you done anything exciting lately?\n\n",
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  if (response.data.choices[0].text?.split(":::")) {
    return response.data.choices[0].text
      ?.split(":::")
      .map((value) => value.replace(/(\r\n|\n|\r)/gm, "")) as string[];
  } else {
    return ["Hey, how are you", "Hey, its been awhile lets cautch up"];
  }
}

export { getStimulus, getOpenAi };
