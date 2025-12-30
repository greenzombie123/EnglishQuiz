import type { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { pool } from "../pool.ts";
import type { QuestionSlideData } from "../components/QuestionSlide.ts";
import type {IntroSlideData } from "../components/IntroSlide.ts";
import { format } from "node-pg-format";

export const getCreateLessonPage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return res.redirect("/");
  const { lessonId } = req.params as { lessonId: string };
  res.locals.lessonId = lessonId || ""
  res.render("createLesson");
};

type QuestionSlide = Omit<QuestionSlideData, "type"> & {
  slideorder: number;
};

type IntroSlide = Omit<IntroSlideData, "type"> & {
  slideorder: number;
};

export const addLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return res.redirect("/");
  const { username: teacherName } = req.user as { username: string };
  const { question, intro, lessonName, groupname, lessonId } = req.body as {
    question: QuestionSlide[] | undefined;
    intro: IntroSlide[] | undefined;
    lessonName: string;
    groupname: string;
    lessonId:string
  };


  const introString = createIntroSQLString(intro);
  const questionString = createQuestionSQLString(question);

  await insertLesson(
    introString,
    questionString,
    lessonName,
    teacherName,
    groupname,
    lessonId
  );

  res.redirect("/lessons");
};

// Create a query string
const createIntroSQLString = (slides: IntroSlide[] | undefined) => {
  if (!slides) return "";

  const introSlides = slides.map((slide) => [
    slide.targetWord,
    slide.definition,
    slide.slideorder,
  ]);

  const introColumns = ["targetword", "definition", "slideorder"];

  return format(
    "INSERT INTO introslides (%I) VALUES %L RETURNING id",
    introColumns,
    introSlides
  );
};

const createQuestionSQLString = (slides: QuestionSlide[] | undefined) => {
  if (!slides) return "";

  const questionslides = slides.map((slide) => [
    slide.question,
    slide.correctAnswer,
    slide.wrongAnswer1,
    slide.wrongAnswer2,
    slide.wrongAnswer3,
    slide.slideorder,
  ]);

  const questionColumns = [
    "question",
    "correctanswer",
    "wronganswer1",
    "wronganswer2",
    "wronganswer3",
    "slideorder",
  ];

  return format(
    "INSERT INTO questionslides (%I) VALUES %L RETURNING id",
    questionColumns,
    questionslides
  );
};

// Extract id values from each row in the rows prop. Used for bridging tables
const getIds = (lessonId: string, rows: { id: string }[]) => {
  return rows.map((row) => [lessonId, row.id]);
};

const insertLesson = async (
  introString: string,
  questionString: string,
  lessonName: string,
  teacherName: string,
  groupName: string,
  oldLessonId:string
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const teacherIdQuery = "SELECT id FROM teachers WHERE username = $1";
    const { rows } = await client.query<{ id: string }>(teacherIdQuery, [
      teacherName,
    ]);
    const teacherId = rows[0]!.id;

    if (teacherId) {

      // If the id of the lesson being edited is passed, erase it and its slides and replace them with a new lesson and its slides
      if(oldLessonId){
        await client.query(`DELETE FROM lessons WHERE id=$1`, [oldLessonId])
      }

      const { rows } = await client.query(
        `INSERT INTO lessons (name, teacherid, groupname) VALUES('${lessonName}', '${teacherId}', '${groupName}') RETURNING id`
      );

      // Extract lesson id
      const lessonId = rows[0]!.id;


      if (questionString) {
        const { rows } = await client.query(questionString);
        const questionIdsWithLessonId = getIds(lessonId, rows);
        const lessonQuestionString = format(
          "INSERT INTO lessons_questionslides (lessonid, questionslideid) VALUES %L",
          questionIdsWithLessonId
        );
        await client.query(lessonQuestionString);
      }

      if (introString) {
        const { rows } = await client.query(introString);
        console.log(rows)
        const introIdsWithLessonId = getIds(lessonId, rows);
        const lessonIntroString = format(
          "INSERT INTO lessons_introslides (lessonid, introslideid) VALUES %L",
          introIdsWithLessonId
        );
        // console.log(lessonIntroString);
        await client.query(lessonIntroString);
      }

      await client.query("COMMIT");
    }
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
