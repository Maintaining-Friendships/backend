import { notFoundResponse, successResponse } from "../middleware/responses";
import { Request, Response } from "express";
import { getStimulus } from "../services/stimulus/selectQuestion";

export default {
  openEndedQuestion: async function (req: Request, res: Response) {
    //Function that returns an open ended question for people to talk about
    // Get a reference to the "items" collection
    let stimulus: string = await getStimulus();
    successResponse(res, { stimulus });
  },
};
