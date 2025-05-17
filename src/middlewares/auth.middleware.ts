import { NextFunction, Request, Response } from "express";
import { getUserData } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";

export default (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers?.authorization;

  if (!authorization) {
    return res.status(403).json({ message: "Unauthorized", data: null });
  }

  const [prefix, token] = authorization.split(" ");

  if (!(prefix === "Bearer" && token)) {
    return res.status(403).json({ message: "Unauthorized", data: null });
  }

  let user;
  try {
    user = getUserData(token);
  } catch (error) {
    return res.status(403).json({ message: "Invalid token", data: null });
  }

  if (!user) {
    return res.status(403).json({ message: "Unauthorized", data: null });
  }

  (req as IReqUser).user = user;
  next();
};
