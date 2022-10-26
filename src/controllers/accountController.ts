import { successResponse } from "../middleware/responses"
import { Request, Response } from 'express'
import { sendOTP, checkOTP } from "../middleware/optVerification";


export default {
    accountInfo: async function (req: Request, res: Response) {
        //function that returns the data of the client
        return successResponse(res, {
            name: "Henry Marks"
        })
    },
    getOtp: async function (req: Request, res: Response) {
        //function that sends an OTP to client
        sendOTP(req.body.phoneNumber, req, res)
    },
    verifyOtp: async function (req: Request, res: Response) {
        //function that checks the validity of an OTP to verify if the client is authenticated
        checkOTP(req.body.phoneNumber, req.body.oneTimeCode, req, res)
    }
}