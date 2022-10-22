import { Response } from "express";

export const successResponse = (res: Response, extraParams: any = null) => {
  const resObject = {
    isSuccess: true,
    statusCode: 200,
  }
  appendExtraData(resObject, extraParams)
  return res.json(resObject)
}

export const notFoundResponse = (res: Response, extraParams: any = null) => {
  const resObject = {
    isSuccess: false,
    statusCode: 404,
  }
  appendExtraData(resObject, extraParams)
  return res.json(resObject)
}

export const badRequestResponse = (res: Response, extraParams: any = null) => {
  const resObject = {
    isSuccess: false,
    statusCode: 400,
  }
  appendExtraData(resObject, extraParams)
  return res.json(resObject)
}

const appendExtraData = (resObject: any, extraParams: any = null) => {
  if (extraParams)
    Object.keys(extraParams).map((x) => (resObject[x] = extraParams[x]))
}