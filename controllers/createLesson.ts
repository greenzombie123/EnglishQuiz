import type { NextFunction, Request, Response } from "express";
import { pool } from "../pool.ts";
import { format } from "node-pg-format";
import {
  createIntroSQLString,
  createQuestionSQLString,
} from "../querystrings.ts";
import type {
  AddLessonBody,
  LessonIdParams,
} from "../shared.types.ts";
import { createLessonRow, getTeacherId } from "../database/utilities.ts";
import {
  createPresignedUrls,
  extractAudioFiles,
} from "../storage/presignedUrls.ts";
import type { PresignUrlData } from "../storage/presignedUrls.ts";

export const getCreateLessonPage = (
  req: Request<LessonIdParams>,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) return res.redirect("/");
  const { lessonId } = req.params;
  res.locals.lessonId = lessonId || "";
  res.render("createLesson");
};

//TODO Validate the values of the body in the request for adding lessons

export const validateAddLesson = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export const addLesson = async (
  req: Request<{}, {}, AddLessonBody>,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) return res.redirect("/");
  const { username: teacherName } = req.user; //as { username: string };
  const { question, intro, lessonName, groupname, lessonId } = req.body;

  const client = await pool.connect();
  await client.query("BEGIN");

  const teacherId = await getTeacherId(client, teacherName);

  let newLessonId;

  if (teacherId)
    newLessonId = await createLessonRow(client, {
      lessonName,
      teacherId,
      groupName: groupname,
    });

  let audioFileNames = extractAudioFiles(question, intro);

  let presignedUrlData: PresignUrlData[] = [];

  if (audioFileNames.length && newLessonId && teacherId) {
    presignedUrlData = await createPresignedUrls(
      audioFileNames,
      newLessonId,
      teacherId,
    );
  }

  await client.query("ROLLBACK");
  client.release();

  // return res.json(presignedUrlData)

  // return res.end();

  const introString = createIntroSQLString(intro);
  const questionString = createQuestionSQLString(question);

  //TODO Change insertLesson by including soundurl
  await insertLesson(
    introString,
    questionString,
    lessonName,
    teacherName,
    groupname,
    lessonId,
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
  oldLessonId: string,
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    //TODO Remove this and pass teacherId as parameter
    const teacherIdQuery = "SELECT id FROM teachers WHERE username = $1";
    const { rows } = await client.query<{ id: string }>(teacherIdQuery, [
      teacherName,
    ]);
    const teacherId = rows[0]!.id;

    //TODO Remove since it will be passed as parameter
    if (teacherId) {
      // If the id of the lesson being edited is passed, erase it and its slides and replace them with a new lesson and its slides
      if (oldLessonId) {
        await client.query(`DELETE FROM lessons WHERE id=$1`, [oldLessonId]);
      }

      //! Already done, so remove!
      const { rows } = await client.query(
        `INSERT INTO lessons (name, teacherid, groupname) VALUES('${lessonName}', '${teacherId}', '${groupName}') RETURNING id`,
      );

      //! REMOVE. Already have
      // Extract lesson id
      const lessonId = rows[0]!.id;

      //! Updates both questionslides and lesson_questionslides tables. Replace with merge
      if (questionString) {
        const { rows } = await client.query(questionString);
        const questionIdsWithLessonId = getIds(lessonId, rows);
        const lessonQuestionString = format(
          "INSERT INTO lessons_questionslides (lessonid, questionslideid) VALUES %L",
          questionIdsWithLessonId,
        );
        await client.query(lessonQuestionString);
      }

      //! Remove as well
      if (introString) {
        const { rows } = await client.query(introString);
        const introIdsWithLessonId = getIds(lessonId, rows);
        const lessonIntroString = format(
          "INSERT INTO lessons_introslides (lessonid, introslideid) VALUES %L",
          introIdsWithLessonId,
        );
        
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


