import { successResponse } from "../middleware/responses"
import { Request, Response } from 'express'


export default {
    openEndedQuestion: async function (req: Request, res: Response) {
        //Function that returns an open ended question for people to talk about
        let listOfQuestions: string[]  = [
            "What was the most interesting thing you did today?", "Who is your hero?", "What would you change about yourself if you could?"
        ]

        let random_idx = Math.floor(Math.random() * listOfQuestions.length)
        let question: String = listOfQuestions[random_idx]
        
        return successResponse(res, {
            question: question
        })
    }
}