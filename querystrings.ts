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