import type { IntroSlideRecord, QuestionSlideRecord } from "./shared.types.ts";
import { format } from "node-pg-format";

// Create a query string to insert introslides

export const createIntroSQLString = (slides: IntroSlideRecord[] | undefined) => {
  if (!slides) return "";

  const introColumns = ["targetword", "definition", "slideorder", "soundurl"]
  
  const introSlides = slides.map((slide) => [
    slide.targetword,
    slide.definition,
    slide.slideorder,
    slide.soundurl
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
    slide.soundurl
  ]);

  const questionColumns = [
    "question",
    "correctanswer",
    "wronganswer1",
    "wronganswer2",
    "wronganswer3",
    "slideorder",
    "soundurl"
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

const updateQSQueryString = `
UPDATE questionslides
SET question=$1, 
    correctanswer=$2, 
    wronganswer1=$3, 
    wronganswer2=$4,
    wronganswer3=$5,
    slideorder=$6,
    soundurl=$7
WHERE id = $9
`

const updateISQueryString = `
UPDATE introslides, 
SET targetword=$1, 
    definition=$2, 
    slideorder=$3,
    soundurl=$4
WHERE id = $5
`;