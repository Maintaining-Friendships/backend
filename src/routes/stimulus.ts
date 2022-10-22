import express, { Request, Response } from 'express'
const router = express.Router()

import accountController from "../controllers/stimulusController"

router.get('/open-ended-question', function (req: Request, res: Response) {
    return accountController.openEndedQuestion(req, res)
})

export default router