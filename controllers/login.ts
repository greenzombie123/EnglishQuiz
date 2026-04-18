import type { NextFunction, Request, Response } from "express";
import passport from "passport";

export const getLogInPage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.render("login");
};

export const logInUser = () =>
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
  });

