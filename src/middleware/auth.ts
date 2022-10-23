import { Request, Response, NextFunction } from "express";
import { nextTick } from "process";
import { optVerification } from "./optVerification";

const ensureAuthorized = (req: Request, res: Response, next: NextFunction) => {
  console.log("phone number", req.body.phoneNumber);
  optVerification(req.body.phoneNumber, req, res);
  return next();
};
export default ensureAuthorized;
