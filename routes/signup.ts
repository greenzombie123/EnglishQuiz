import { Router } from "express";
import { checkSignUpForm, getSignUpPage, validateSignUpForm } from "../controllers/signup.ts";

const signupRouter = Router();

signupRouter.get("/", getSignUpPage)
signupRouter.post("/", checkSignUpForm(), validateSignUpForm)

export default signupRouter