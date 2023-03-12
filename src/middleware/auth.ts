import { Request, Response, NextFunction } from "express";
import { badRequestResponse } from "./responses";
import { verifyJWT } from "./token";
// import { optVerification } from "./optVerification";
//lol
const ensureAuthorized = (req: Request, res: Response, next: NextFunction) => {
  let authToken: string | undefined = req.headers["authorization"];

  if (authToken != undefined) {
    verifyJWT(authToken, res, next);
  } else {
    badRequestResponse(res, {
      error:
        "please get a new auth token via OTP, or provide your token in the header",
    });
  }
};
export default ensureAuthorized;
