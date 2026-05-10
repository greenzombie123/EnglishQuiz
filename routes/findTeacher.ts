import { Router } from "express";
import {
    addStudentToTeacher,
  findTeacher,
  getFindTeacherPage,
  getTeacher,
} from "../controllers/findTeacher.ts";

// EndPoint "/findTeacher"
const findTeacherRouter = Router();

findTeacherRouter.post("/finished", addStudentToTeacher);

findTeacherRouter.get("/", getFindTeacherPage);

findTeacherRouter.post("/", findTeacher, getTeacher);



export default findTeacherRouter;
