import { Router } from "express";
import { authenticateUser, checkSignUpForm, getSignUpCompletePage, getSignUpPage, validateSignUpForm } from "../controllers/signup.ts";

const signupRouter = Router();


signupRouter.get("/", getSignUpPage)
signupRouter.get("/completed", getSignUpCompletePage)
signupRouter.post("/", checkSignUpForm(), validateSignUpForm, authenticateUser)


export default signupRouter