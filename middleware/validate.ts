import type { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

// Call this when user is trying to register. Checks if all fields are filled or not and sanitize the values
export const checkSignUpForm = () =>
  body(["username", "password"]).notEmpty().escape();

export const checkfindTeacherForm = ()=> body("teacher").notEmpty().escape() 

// Called after checkSignUpForm to verify results
export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get validation results
  const result = validationResult(req);

  // Check if there are no validation errors
  if (result.isEmpty()) next();
  else res.send({ errors: result.array() });
};
