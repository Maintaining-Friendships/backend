import { successResponse } from "../middleware/responses"
import { Request, Response } from 'express'


export default {
    accountInfo: async function (req: Request, res: Response) {
        //function that returns the data of the client
        return successResponse(res, {
            name: "Henry Marks"
        })
      
    }
}