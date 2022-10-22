"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badRequestResponse = exports.notFoundResponse = exports.successResponse = void 0;
const successResponse = (res, extraParams = null) => {
    const resObject = {
        isSuccess: true,
        statusCode: 200,
    };
    appendExtraData(resObject, extraParams);
    return res.json(resObject);
};
exports.successResponse = successResponse;
const notFoundResponse = (res, extraParams = null) => {
    const resObject = {
        isSuccess: false,
        statusCode: 404,
    };
    appendExtraData(resObject, extraParams);
    return res.json(resObject);
};
exports.notFoundResponse = notFoundResponse;
const badRequestResponse = (res, extraParams = null) => {
    const resObject = {
        isSuccess: false,
        statusCode: 400,
    };
    appendExtraData(resObject, extraParams);
    return res.json(resObject);
};
exports.badRequestResponse = badRequestResponse;
const appendExtraData = (resObject, extraParams = null) => {
    if (extraParams)
        Object.keys(extraParams).map((x) => (resObject[x] = extraParams[x]));
};
