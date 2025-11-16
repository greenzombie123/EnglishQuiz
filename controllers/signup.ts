import type { Request, Response, NextFunction } from "express";
import { body, validationResult,matchedData } from "express-validator";

export const getSignUpPage = (req: Request, res: Response) => {
    req.body
  res.render("signupPage");
};

interface TypedRequestBody<T> extends Request{
    body:T
}

export const handleDoesUserExist = (req:TypedRequestBody<{username:string, password:string, userType:string}>, res:Response, next:NextFunction)=>{
    const {username, password, userType} = req.body
}

// Call this when user is trying to register. Checks if all fields are filled or not and sanitize the values
export const checkSignUpForm = () =>
  body(["username", "password"]).notEmpty().escape();

// Called after checkSignUpForm to verify results
export const validateSignUpForm = (req: Request, res: Response,next: NextFunction) => {

  // Get validation results
  const result = validationResult(req);
  
  // Check if there are no validation errors
  if (result.isEmpty()) next();
  else res.send({ errors: result.array() });
};
