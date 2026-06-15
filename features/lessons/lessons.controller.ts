import type { Request, Response, NextFunction } from "express";
import { pool } from "../../pool.ts";
import { format } from "node-pg-format";
import { Lesson } from "./lessons.model.ts";
import { createLessonStore } from "./lessons.service.ts";
import type {
  LessonIdParams,
} from "../../shared.types.ts";

export const getLesson = async (
  req: Request<LessonIdParams>,
  res: Response,
  next: NextFunction,
) => {

  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.getLessonById(Number(lessonId))

    if (!lesson) throw Error("Lesson doesn't exist")

    res.send(lesson);

  } catch (error) {
    res.send(error)
  }
};


export const getLessonPage = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { lessonId } = req.params as { lessonId: string };
  res.locals.lessonId = parseInt(lessonId);
  res.locals.lessonName = req.query.lessonname as string;
  res.render("lesson");
};

export const getDashBoard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) return res.redirect("/");
  const { username, userType } = req.user;
  const lessonData = await Lesson.getAllLessonDataByUserName(username, userType) //getLessons(userType, username);
  const lessonStore = createLessonStore(lessonData);

  res.locals = { username, userType, lessonStore };
  res.render("dashboard");
};

export const deleteLesson = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { lessonId } = req.params as { lessonId: string };
  const queryString = format("DELETE FROM lessons WHERE id = %L", lessonId);
  await pool.query(queryString);
  res.send("The lesson was deleted.");
};

export const postLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
}
