import { Request, Response, NextFunction } from "express"
import { nextTick } from "process"

const ensureAuthorized = (req: Request, res: Response, next: NextFunction) => {
    console.log("check if user is authorized")
    return next()
}
export default ensureAuthorized