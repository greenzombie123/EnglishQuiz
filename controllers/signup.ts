import type { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { pool } from "../pool.ts";
import { v7 as createId } from "uuid";

export const getSignUpCompletePage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return res.render("/");
  res.locals.username = req.user.username
  res.render("signupComplete");
};

export const getSignUpPage = (req: Request, res: Response) => {
  res.render("signupPage");
};

// Allows you to define the types
export interface TypedRequestBody extends Request {
  body: {
    username: string;
    password: string;
    userType: "teacher" | "student";
  };
}

// Authenticates user
export const handleAddUser = async (
  req: TypedRequestBody,
  res: Response,
  next: NextFunction
) => {
  const { username, password, userType } = req.body;

  const result = await handleDoesUserExist(username, password);

  if (result) {
    res.end("User exists, bro!");
    return;
  }

  if (userType === "teacher") {
    await handleAddNewTeacher(username, password);
    const user = { username, userType };
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/signup/completed");
    });
  } else {
    await handleAddNewStudent(username, password);
    const user = { username, userType };
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/findTeacher");
    });
  }

};

// Check if the user has already registered or not
const handleDoesUserExist = async (username: string, password: string) => {
  const teachers = await pool.query(
    "SELECT * FROM teachers WHERE username = $1",
    [username]
  );
  const students = await pool.query(
    "SELECT * FROM students WHERE username = $1",
    [password]
  );

  if (teachers.rowCount === null || students.rowCount === null) return false;
  else if (teachers.rowCount + students.rowCount === 0) return false;
  return true;
};

// Add new teacher to the database
const handleAddNewTeacher = async (username: string, password: string) => {
  const id = createId();
  await pool.query(
    "INSERT INTO teachers (username, password, id) VALUES($1,$2,$3)",
    [username, password, id]
  );
};

// Add new student to the database
const handleAddNewStudent = async (username: string, password: string) => {
  const id = createId();
  await pool.query(
    "INSERT INTO students (username, password, id) VALUES($1,$2,$3)",
    [username, password, id]
  );
};

// Call this when user is trying to register. Checks if all fields are filled or not and sanitize the values
export const checkSignUpForm = () =>
  body(["username", "password"]).notEmpty().escape();

// Called after checkSignUpForm to verify results
export const validateSignUpForm = (
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
