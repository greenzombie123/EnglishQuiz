import { Router } from "express";
import {
  getLogInPage,
  logInUser,
  redirectToDashBoard,
  getSignUpCompletePage,
  getSignUpPage,
  handleAddUser,
} from "./auth.controller.ts";
import {
  addStudentToTeacher,
  findTeacher,
  getFindTeacherPage,
  getTeacher,
} from "../../controllers/findTeacher.ts";
import { checkSignUpForm, validate } from "../../middleware/validate.ts";

// Endpoint "/login"
export const logInRouter = Router();

logInRouter.get("/", getLogInPage);

logInRouter.post("/", logInUser, redirectToDashBoard);

// Endpoint "/signup"
export const signupRouter = Router();

signupRouter.get("/", getSignUpPage);

signupRouter.get("/completed", getSignUpCompletePage);

signupRouter.post("/", checkSignUpForm(), validate, handleAddUser);

// Endpoint "/findTeacher"

const findTeacherRouter = Router();

findTeacherRouter.post("/finished", addStudentToTeacher);

findTeacherRouter.get("/", getFindTeacherPage);

findTeacherRouter.post("/", findTeacher, getTeacher);



export default findTeacherRouter;

