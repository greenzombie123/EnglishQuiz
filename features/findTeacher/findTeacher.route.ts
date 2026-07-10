import { type NextFunction, Router, type Request, type Response } from "express";
import {
  addStudentToTeacher,
  searchTeacher,
  getFindTeacherPage
} from "./findTeacher.controller.ts"
import { checkfindTeacherForm, validate } from "../../middleware/validate.ts";

// Endpoint "/findTeacher"

const findTeacherRouter = Router();

findTeacherRouter.post("/finished", addStudentToTeacher);

findTeacherRouter.get("/", getFindTeacherPage);

findTeacherRouter.post("/", checkfindTeacherForm(), validate, searchTeacher);



export default findTeacherRouter;

