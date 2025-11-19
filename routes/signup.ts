import { Router } from "express";
import { checkSignUpForm, getSignUpCompletePage, getSignUpPage, handleAddUser, validateSignUpForm } from "../controllers/signup.ts";

const signupRouter = Router();


signupRouter.get("/", getSignUpPage)
signupRouter.get("/completed", getSignUpCompletePage)
signupRouter.post("/", checkSignUpForm(), validateSignUpForm, handleAddUser)


export default signupRouter