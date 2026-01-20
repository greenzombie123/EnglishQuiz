import type { IntroSlideRecord, QuestionSlideRecord } from "./shared.types.ts";
import { format } from "node-pg-format";

// Create a query string to insert introslides

export const createIntroSQLString = (slides: IntroSlideRecord[] | undefined) => {
  if (!slides) return "";

  const introColumns = ["targetword", "definition", "slideorder"]
  
  const introSlides = slides.map((slide) => [
    slide.targetword,
    slide.definition,
    slide.slideorder,
  ]);

  return format(
    "INSERT INTO introslides (%I) VALUES %L RETURNING id",
    introColumns,
    introSlides
  );
};

// Create a query string to insert questionslides

export const createQuestionSQLString = (slides: QuestionSlideRecord[] | undefined) => {
  if (!slides) return "";

  const questionslides = slides.map((slide) => [
    slide.question,
    slide.correctanswer,
    slide.wronganswer1,
    slide.wronganswer2,
    slide.wronganswer3,
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

export const queryIntroSlideRecords = `
    SELECT targetword, definition, slideorder, type FROM introslides
    INNER JOIN lessons_introslides
    ON lessons_introslides.introslideid = introslides.id
    WHERE lessons_introslides.lessonid = $1
`

export const queryQuestionSlideRecords = `
    SELECT question, correctanswer,  wronganswer1, wronganswer2, wronganswer3, slideorder, type FROM questionslides 
    INNER JOIN lessons_questionslides 
    ON lessons_questionslides.questionslideid = questionslides.id
    WHERE lessons_questionslides.lessonid = $1
    ORDER BY slideorder;
`

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