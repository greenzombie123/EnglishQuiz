import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import passport from "passport";
import { getDashBoard } from "../controllers/lessons.ts";
import { getLogInPage, logInUser } from "../controllers/login.ts";

const logInRouter = Router();

logInRouter.get("/", getLogInPage);

logInRouter.post(
  "/",
  logInUser(),
  (req:Request, res:Response, next:NextFunction)=>{
    res.redirect('lessons')
  }
);

export default logInRouter
