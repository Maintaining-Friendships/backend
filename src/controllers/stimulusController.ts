import { notFoundResponse, successResponse } from "../middleware/responses";
import { Request, Response } from "express";
import { getOpenAi, getStimulus } from "../services/stimulus/selectQuestion";

export default {
  openEndedQuestion: async function (req: Request, res: Response) {
    //Function that returns an open ended question for people to talk about
    // Get a reference to the "items" collection
    //let stimulus: string = await getStimulus();
    let openAiStimulus: string[] = await getOpenAi();
    successResponse(res, { openAiStimulus });
  },
};
