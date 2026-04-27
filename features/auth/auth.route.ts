import { Router } from "express";
import { getLogInPage, logInUser, redirectToDashBoard } from "./auth.controller.ts"
import { checkSignUpForm, getSignUpCompletePage, getSignUpPage, handleAddUser, validateSignUpForm } from "./../../controllers/signup.ts";

export const logInRouter = Router();

logInRouter.get("/", getLogInPage);

logInRouter.post(
  "/",
  logInUser,
  redirectToDashBoard
); 

export const signupRouter = Router();


signupRouter.get("/", getSignUpPage)

signupRouter.get("/completed", getSignUpCompletePage)

signupRouter.post("/", checkSignUpForm(), validateSignUpForm, handleAddUser)

