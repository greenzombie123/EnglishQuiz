import type { Request, Response, NextFunction } from "express";
import { pool } from "../pool.ts";
import { format } from "node-pg-format";
import type {
  IntroSlideRecord,
  LessonData,
  LessonIdParams,
  LessonSlideData,
  QuestionSlideRecord,
  SlideRecord,
} from "../shared.types.ts";

export const fetchLessonSlides = async (
  req: Request<LessonIdParams>,
  res: Response,
  next: NextFunction,
) => {

  try {
    const { lessonId } = req.params;

    const { rows } = await pool.query<{ name: string; groupname: string }>(
    "SELECT name, groupname FROM lessons WHERE id=$1",
    [lessonId],
    );

    if(!rows[0]) throw Error("Lesson doesn't exist")

    // Grab all types of slides for the requested lesson
    const lessonSlideData:LessonSlideData = await getLessonSlideData(lessonId)

    const sortedSlides = sortSlides(lessonSlideData)

    const lesson:LessonData = {
      name:rows[0].name,
      groupname:rows[0].groupname,
      slides:sortedSlides
    }

    res.send(lesson);

  } catch (error) {
    res.send(error)
  }
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

// Return slides for a lesson. TypeScript will complain if new slide types are added but not implemented
const getLessonSlideData = async (lessonId:string): Promise<LessonSlideData> => {
  return {
    intro: await getIntroSlides(lessonId),
    question: await getQuestionSlides(lessonId)
  }
};

const getIntroSlides = async (lessonId:string): Promise<IntroSlideRecord[] | []> => {
  const { rows } = await pool.query<IntroSlideRecord>(`
    SELECT 
    targetword, 
    definition,
    slideorder,
    type
    FROM introslides
    INNER JOIN lessons_introslides 
    ON lessons_introslides.introslideid = introslides.id
    WHERE lessons_introslides.lessonid = $1
    `, [lessonId]);
  return rows.length ? rows : [];
};

const getQuestionSlides = async (lessonId:string): Promise<QuestionSlideRecord[] | []> => {
  const { rows } = await pool.query<QuestionSlideRecord>(`
    SELECT 
    question, 
    correctanswer, 
    wronganswer1, 
    wronganswer2,
    wronganswer3,
    slideorder,
    type
    FROM questionslides
    INNER JOIN lessons_questionslides
    ON lessons_questionslides.lessonid = questionslides.id
    WHERE lessons_questionslides.lessonid = $1
    `, [lessonId]);
  return rows.length ? rows : [];
};

// Spread all slide arrays into one
const sortSlides = (lessonSlideData: LessonSlideData) => {

  let slides:SlideRecord[] = []
  let keys:keyof LessonSlideData

  for (keys in lessonSlideData) {
    slides = [...slides, ...lessonSlideData[keys]]
  }

  return slides.sort(
    (currentSlide, nextSlide) => currentSlide.slideorder - nextSlide.slideorder,
  );
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
  const lessonsData = await getLessons(userType, username);
  const lessonStore = sortLessons(lessonsData);

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
  next: NextFunction,
) => {
  const { lessonId } = req.params as { lessonId: string };
  const queryString = format("DELETE FROM lessons WHERE id = %L", lessonId);
  await pool.query(queryString);
  res.send("The lesson was deleted.");
};
