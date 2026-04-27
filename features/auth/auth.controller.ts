import type { NextFunction, Request, Response } from "express";
// import passport from "./../../config/passport.config"
import passport from "passport";

// Logging In

export const getLogInPage = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.render("login");
};

export const logInUser =
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
  });

export const redirectToDashBoard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.redirect('lessons')
};
