import { Router } from "express";
import {
  addStudentToTeacher,
  getFindTeacherPage,
  getTeacher} from "./findTeacher.controller.ts"
import { checkfindTeacherForm, validate } from "../../middleware/validate.ts";

// Endpoint "/findTeacher"

const findTeacherRouter = Router();

findTeacherRouter.post("/finished", addStudentToTeacher);

findTeacherRouter.get("/", getFindTeacherPage);

findTeacherRouter.post("/", checkfindTeacherForm(), validate, getTeacher);



export default findTeacherRouter;

