import jwt from "jsonwebtoken";
import { badRequestResponse, successResponse } from "./responses";
import { NextFunction, Response } from "express";

export const createJWT = (phoneNumber: string, otpCode: string): string => {
  let token: string = jwt.sign(
    { phoneNumber: phoneNumber, otpCode: otpCode },
    process.env.JWT_CODE!,
    {
      expiresIn: "10 days", // expires in 356 days
    }
  );
  return token;
};

export const verifyJWT = (token: string, res: Response, next: NextFunction) => {
  //Check if the JWT is valid, if it is valid, allow the auth to continue
  jwt.verify(token, process.env.JWT_CODE!, function (err, decoded) {
    if (err) {
      return badRequestResponse(res, { error: err });
    }
    return next();
  });
};
