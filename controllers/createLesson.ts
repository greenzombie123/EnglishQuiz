import type { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { pool } from "../pool.ts";
import type { QuestionSlideData } from "../components/QuestionSlide.ts";
import type { IntroSlideData } from "../components/IntroSlide.ts";

export const getCreateLessonPage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if(!req.user)return res.redirect("/")
  res.render("createLesson");
};

type QuestionSlide = Omit<QuestionSlideData, "type"> & {
  slideorder: number;
};

type IntroSlide = Omit<IntroSlideData, "type"> & {
  slideorder: number;
};

type Slide = QuestionSlide | IntroSlide;

export const addLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return res.redirect("/");
  const { username } = req.user as { username: string };
  const { question, intro, lessonName } = req.body as {
    question: QuestionSlide[];
    intro: IntroSlide[];
    lessonName: string;
  };

  console.log(131231, intro, question)

  const introSlidesValues = createIntroValues(intro);
  const questionSlidesValues = createQuestionValues(question);

  await insertLesson(
    introSlidesValues,
    questionSlidesValues,
    lessonName,
    username
  );

  res.end();
};

// Create a string to do a bulk insert. Each slide has its values placed in parentheses, seperated by a comma.
const createIntroValues = (slides: IntroSlide[]) => {
  const introSlideValues = slides.map(
    (slide) =>
      `('${slide.targetWord}','${slide.definition}',${slide.slideorder})`
  );

  return introSlideValues.join(", ");
};

const createQuestionValues = (slides: QuestionSlide[]) => {
  const questionSlideValues = slides.map(
    (slide) => `
        ('${slide.question}','${slide.correctAnswer}','${slide.wrongAnswer1}',
        '${slide.wrongAnswer2}','${slide.wrongAnswer3}','${slide.slideorder}')
        `
  );

  return questionSlideValues.join(", ");
};

const insertLesson = async (
  introString: string,
  questionString: string,
  lessonName: string,
  teacherName: string
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const teacherIdQuery = "SELECT id FROM teachers WHERE username = $1";
    const { rows } = await client.query<{ id: string }>(teacherIdQuery, [
      teacherName,
    ]);
    if (rows[0]) {
      const { id } = rows[0];
      const string = `
    WITH newLessonId AS (
    INSERT INTO lessons (name, teacherid) VALUES( 
        $1,
        $2
    ) 
    RETURNING id
) 
, newQuestionSlideIds AS (
    INSERT INTO questionslides 
    (question, correctanswer, wronganswer1, wronganswer2, wronganswer3, slideorder) 
    VALUES${questionString}
    RETURNING id 
) 

, newIntroSlideIds AS (
    INSERT INTO introslides 
    (
        targetword, 
        definition,
        slideorder 
    )
    VALUES${introString} 
    RETURNING id
)

, newLessonIntroSlides AS (
    INSERT INTO lessons_introslides 
    (
        lessonid, introslideid
    )
    SELECT newLessonId.id, newIntroSlideIds.id FROM newLessonId, newIntroSlideIds
)

INSERT INTO lessons_questionslides 
(
    lessonid,
    questionslideid
)

SELECT newLessonId.id, newQuestionSlideIds.id FROM newLessonId, newQuestionSlideIds;
`;
      await client.query(string, [lessonName, id]);
      await client.query("COMMIT");
    }
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
