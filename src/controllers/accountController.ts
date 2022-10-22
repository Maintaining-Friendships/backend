import { successResponse } from "../middleware/responses"
import { Request, Response } from 'express'


export default {
    accountInfo: async function (req: Request, res: Response) {
        return successResponse(res, {
            name: "Henry MARKS"
        })
      
    }
}