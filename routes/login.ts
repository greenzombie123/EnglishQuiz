import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import passport from "passport";

const logInRouter = Router();

logInRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.render("login");
});

logInRouter.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req:Request, res:Response, next:NextFunction)=>{
    console.log(req.user)
    res.end()
  }
);

export default logInRouter
