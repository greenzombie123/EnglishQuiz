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
  // if(!req.user)return res.redirect("/")
  res.render("createLesson");
};

type QuestionSlide = Omit<QuestionSlideData, "type"> & {
  slideorder: number;
};

type IntroSlide = Omit<IntroSlideData, "type"> & {
  slideorder: number;
};

type Slide = QuestionSlide | IntroSlide;

export const addLesson = (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.body)
  const { question, intro, lessonName } = req.body as {
    question: QuestionSlide[];
    intro: IntroSlide[];
    lessonName: string;
  };
  
  console.log(createIntroValues(intro));

  res.end();
};

const createIntroValues = (slides: IntroSlide[]) => {
  const introSlideValues = slides.map(
    (slide) => `('${slide.targetWord}','${slide.definition}',${slide.slideorder})`
  );

  return introSlideValues.join(", ");
};

const createQuestionValues = (slides: QuestionSlide[]) => {
  const questionSlideValues = slides.map(
    (slide) => `
        (${slide.question},${slide.correctAnswer},${slide.wrongAnswer1},
        ${slide.wrongAnswer2},${slide.wrongAnswer3},${slide.slideorder},)
        `
  );

  questionSlideValues.join(", ");
  return questionSlideValues;
};
