import type { NextFunction, Request, Response } from "express";
import passport from "passport";
import { body, validationResult } from "express-validator";
import { handleAddNewStudent, handleAddNewTeacher, handleDoesUserExist } from "./auth.service.ts";

// Logging In

export const getLogInPage = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.render("auth/login");
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


// Sign Up

export const getSignUpCompletePage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return res.render("/");
  res.locals.username = req.user.username
  res.render("auth/signupComplete");
};

export const getSignUpPage = (req: Request, res: Response) => {
  res.render("auth/signupPage");
};

// Allows you to define the types
export interface TypedRequestBody extends Request {
  body: {
    username: string;
    password: string;
    userType: "teacher" | "student";
  };
}

// Authenticates user
export const handleAddUser = async (
  req: TypedRequestBody,
  res: Response,
  next: NextFunction
) => {
  const { username, password, userType } = req.body;

  const result = await handleDoesUserExist(username);

  if (result) {
    res.end("User exists, bro!");
    return;
  }

  if (userType === "teacher") {
    await handleAddNewTeacher(username, password);
    const user = { username, userType };
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/signup/completed");
    });
  } else {
    await handleAddNewStudent(username, password);
    const user = { username, userType };
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/findTeacher");
    });
  }

};


