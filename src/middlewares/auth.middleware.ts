import { NextFunction, Request, Response } from "express";
import { getUserData } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";

export default (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers?.authorization;

  if (!authorization) {
    return response.unathorize(res);
  }

  const [prefix, token] = authorization.split(" ");

  if (!(prefix === "Bearer" && token)) {
    return response.unathorize(res);
  }

  let user;
  try {
    user = getUserData(token);
  } catch (error) {
    return response.unathorize(res);
  }

  if (!user) {
    return response.unathorize(res);
  }

  (req as IReqUser).user = user;
  next();
};
