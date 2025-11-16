import { Router } from "express";
import { authenticateUser, checkSignUpForm, getSignUpPage, validateSignUpForm } from "../controllers/signup.ts";

const signupRouter = Router();

signupRouter.get("/", getSignUpPage)
signupRouter.post("/", checkSignUpForm(), validateSignUpForm, authenticateUser)

export default signupRouter