import { Router } from "express";
import { checkSignUpForm, getSignUpPage, registerUser, validateSignUpForm } from "../controllers/signup.ts";

const signupRouter = Router();

signupRouter.get("/", getSignUpPage)
signupRouter.post("/", checkSignUpForm(), validateSignUpForm, registerUser)

export default signupRouter