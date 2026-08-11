import type { Request, Response, NextFunction } from "express";
import { pool } from "../../pool.ts";
import { format } from "node-pg-format";
import { Lesson } from "./lessons.model.ts";
import { createLessonStore, postLessonService } from "./lessons.service.ts";
import type {
  LessonIdParams,
} from "../../shared.types.ts";
import { dirname } from "../../dirNames.ts"

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

//TODO Change to where the user is sent to dashboard right after the request is successful.
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
  if (!req.user || req.user.userType === "student") return res.redirect("/");

  const { username } = req.user;
  const { question, intro, name, groupname, id } = req.body;

  const lessonId = id === "" ? "" : parseInt(id)

  const postLessonResult = await postLessonService(username, { name, groupname, lessonId, questionSlides: question, introSlides: intro })

  if (postLessonResult.isError) {
    throw postLessonResult.message
  }

  res.sendStatus(200)
}

export const getGroupNames = async (
  req: Request<{ lessonId: string }>,
  res: Response,
  next: NextFunction,
) => {

  if (!req.user) res.render("/")

  const { username } = req.user!

  const groupnames = await Lesson.getAllGroupNamesByTeacher(username)

  res.send(groupnames)
}

export const getCreateLessonPage = (
  req: Request<{ lessonId: number }>,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) return res.redirect("/");

  const { lessonId } = req.params;

  res.locals.lessonId = lessonId || "";

  res.render("createLesson");
};

export const getAudioFiles = (
  req: Request,
  res: Response,
  next: NextFunction) => {

  res.sendFile("/public/hello.mp3", { root: dirname })
}
