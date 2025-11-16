import { Router } from "express";
import { getSignUpPage } from "../controllers/signup.ts";

const signupRouter = Router();

signupRouter.get("/", getSignUpPage)
// signupRouter.get("/", getSignUpPage)

// signupRouter.post("/")

export default signupRouter