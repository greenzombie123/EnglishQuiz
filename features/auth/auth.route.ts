import { Router } from "express";
import {
  getLogInPage,
  logInUser,
  redirectToDashBoard,
  checkSignUpForm,
  getSignUpCompletePage,
  getSignUpPage,
  handleAddUser,
  validateSignUpForm,
} from "./auth.controller.ts";

// Endpoint is /login
export const logInRouter = Router();

logInRouter.get("/", getLogInPage);

logInRouter.post("/", logInUser, redirectToDashBoard);

export const signupRouter = Router();

signupRouter.get("/", getSignUpPage);

signupRouter.get("/completed", getSignUpCompletePage);

signupRouter.post("/", checkSignUpForm(), validateSignUpForm, handleAddUser);
