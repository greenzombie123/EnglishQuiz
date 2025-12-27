import type { Request, Response, NextFunction } from "express";
import { pool } from "../pool.ts";
import type { IntroSlideData } from "../components/IntroSlide.ts";
import type { QuestionSlideData } from "../components/QuestionSlide.ts";
import { format } from "node-pg-format";

type LessonData = {
  name: string;
  id: number;
  groupname: string;
};

type LessonSlide = {
  targetword: string | null;
  definition: string | null;
  question: string | null;
  correctanswer: string | null;
  wronganswer1: string | null;
  wronganswer2: string | null;
  wronganswer3: string | null;
  slideorder: number;
  type: string;
};

export const fetchLessonSlides = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { lessonId } = req.params as { lessonId: string };
  const { rows: lessonslides } = await pool.query<LessonSlide>(
    queryLessonSlideString,
    [lessonId]
  );
  const slides = transformLessonSlide(lessonslides);
  res.send(slides);
};
const queryLessonSlideString = `
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
WHERE lessons_introslides.lessonid = $1

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
WHERE lessons_questionslides.lessonid = $1
ORDER BY slideorder;
`;

const transformLessonSlide = (slides: LessonSlide[]) => {
  const newSlides = slides.map<IntroSlideData | QuestionSlideData>((slide) => {
    if (slide.type === "intro") {
      return {
        targetWord: slide.targetword as string,
        definition: slide.definition as string,
        type: "intro",
      };
    } else
      return {
        question: slide.question as string,
        correctAnswer: slide.correctanswer as string,
        wrongAnswer1: slide.wronganswer1 as string,
        wrongAnswer2: slide.wronganswer2 as string,
        wrongAnswer3: slide.wronganswer3 as string,
        type: "question",
      };
  });
  return newSlides;
};

export const getLessonPage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { lessonId } = req.params as { lessonId: string };
  res.locals.lessonId = parseInt(lessonId);
  res.locals.lessonName = req.query.lessonname as string;
  res.render("lesson");
};

export const getDashBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return res.redirect("/");
  const { username, userType } = req.user;
  const lessonsData = await getLessons(userType, username);
  const lessonStore = sortLessons(lessonsData);

  res.locals = { username, userType, lessonStore };
  res.render("dashboard");
};

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
  let store: LessonStore = {};
  store.nogroup = [];

  lessons.forEach((lesson) => {
    const groupname = lesson.groupname;
    if (!groupname) store.nogroup!.push(lesson);
    else if (!store[groupname]) {
      store[groupname] = [];
      store[groupname].push(lesson);
    } else {
      store[groupname].push(lesson);
    }
  });

  return store;
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
  next: NextFunction
) => {
  const { lessonId } = req.params as { lessonId: string };
  const queryString = format("DELETE FROM lessons WHERE id = %L", lessonId);
  await pool.query(queryString);
  res.send("The lesson was deleted.");
};

export const getEditLessonPage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { lessonId } = req.params as { lessonId: string };
  const { rows: lessonslides } = await pool.query<LessonSlide>(
    queryLessonSlideString,
    [lessonId]
  );
  const slides = transformLessonSlide(lessonslides);
};
