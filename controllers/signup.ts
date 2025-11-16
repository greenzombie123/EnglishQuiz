import type { Request, Response, NextFunction } from "express";
import { body, validationResult,matchedData } from "express-validator";

export const getSignUpPage = (req: Request, res: Response) => {
  res.render("signupPage");
};

export const registerUser = (req:Request, res:Response, next:NextFunction)=>{
    res.send(req.body)
}

// Call this when user is trying to register. Checks if all fields are filled or not
export const checkSignUpForm = () =>
  body(["username", "password"]).notEmpty().escape();

// Called after checkSignUpForm
export const validateSignUpForm = (req: Request, res: Response,next: NextFunction) => {

  // Get validation results
  const result = validationResult(req);
  
  // Check if there are no validation errors
  if (result.isEmpty()) next();
  else res.send({ errors: result.array() });
};
