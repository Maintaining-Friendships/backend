import express, { Request, Response } from 'express'
const router = express.Router()

import accountController from "../controllers/accountController"

router.get('/account-info', function (req: Request, res: Response) {
    console.log("account routes accessed")
    return accountController.accountInfo(req, res)
})


router.post('/get-otp', function (req: Request, res: Response) {
    console.log("get otp")
    return accountController.getOtp(req, res)
})

router.post('/verify-otp', function (req: Request, res: Response) {
    console.log("verify otp")
    return accountController.getOtp(req, res)
})

export default router