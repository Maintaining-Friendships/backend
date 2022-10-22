import { Request, Response, NextFunction } from "express"
import { nextTick } from "process"

const ensureAuthorized = (req: Request, res: Response, next: NextFunction) => {
    return next()
}
export default ensureAuthorized