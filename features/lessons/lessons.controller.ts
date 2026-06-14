import type { Request, Response, NextFunction } from "express";
import { pool } from "../../pool.ts";
import { format } from "node-pg-format";
import type {
  LessonData,
  LessonIdParams,
  LessonSlideData,
} from "../../shared.types.ts";
import { Lesson } from "./lessons.model.ts";
import { createLessonStore } from "./lessons.service.ts";


//TODO Fix later
export const fetchLessonSlides = async (
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

// TODO Make change
const getLessons = async (userType: string, userName: string) => {
  const queryString = getQueryString(userType);

  const { rows } = await pool.query<LessonData>(queryString, [userName]);

  return rows;
};

const getQueryString = (userType: string) => {
  if (userType === "student") {
    return `SELECT lessons.name, lessons.id, lessons.groupname FROM lessons
            INNER JOIN teachers
            ON lessons.teacherid = teachers.id
            INNER JOIN teachers_students
            ON teachers.username = teachers_students.teacherusername
            WHERE teachers_students.studentusername = $1`;
  } else
    return `SELECT lessons.name, lessons.id, lessons.groupname FROM lessons
            INNER JOIN teachers
            ON lessons.teacherid = teachers.id
            WHERE teachers.username = $1`;
};

type LessonStore = {
  [key: string]: LessonData[];
};

const sortLessons = (lessons: LessonData[]) => {

};

const createQueryLessonString = (lessonId: string) => {
  const queryString = `
SELECT 
targetword, 
definition, 
NULL AS question, 
NULL AS correctanswer, 
NULL AS wronganswer1, 
NULL AS wronganswer2,
NULL AS wronganswer3,
slideorder,
type
FROM introslides 
INNER JOIN lessons_introslides 
ON lessons_introslides.introslideid = introslides.id
WHERE lessons_introslides.lessonid = %L

UNION

SELECT 
NULL AS targetword, 
NULL AS definition, 
question, 
correctanswer, 
wronganswer1, 
wronganswer2,
wronganswer3,
slideorder,
type
FROM questionslides 
INNER JOIN lessons_questionslides 
ON lessons_questionslides.questionslideid = questionslides.id
WHERE lessons_questionslides.lessonid = %L
ORDER BY slideorder;
`;

  return format(queryString, lessonId);
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
