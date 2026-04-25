import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { getLogInPage, logInUser, redirectToDashBoard } from "./auth.controller.ts"

const logInRouter = Router();

logInRouter.get("/", getLogInPage);

logInRouter.post(
  "/",
  logInUser(),
  redirectToDashBoard
);

export default logInRouter