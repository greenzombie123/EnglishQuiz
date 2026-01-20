import type { NextFunction, Request, Response } from "express";
import { pool } from "../pool.ts";
import type { QuestionSlideData } from "../components/QuestionSlide.ts";
import type {IntroSlideData } from "../components/IntroSlide.ts";
import { format } from "node-pg-format";
import { createIntroSQLString, createQuestionSQLString } from "../querystrings.ts";
import type { AddLessonBody, LessonIdParams } from "../shared.types.ts";

export const getCreateLessonPage = (
  req: Request<LessonIdParams>,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return res.redirect("/");
  const { lessonId } = req.params 
  res.locals.lessonId = lessonId || ""
  res.render("createLesson");
};

//TODO Validate the values of the body in the request for adding lessons

export const validateAddLesson = (req:Request, res:Response, next:NextFunction)=>{}

export const addLesson = async (
  req: Request<{}, {}, AddLessonBody>,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return res.redirect("/");
  const { username: teacherName } = req.user //as { username: string };
  const { question, intro, lessonName, groupname, lessonId } = req.body


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
