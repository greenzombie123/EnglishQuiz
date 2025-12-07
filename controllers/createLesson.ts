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

interface QuestionSlide extends QuestionSlideData {
  slideorder: number;
}

interface IntroSlide extends IntroSlideData {
  slideorder: number;
}

type Slide = QuestionSlide | IntroSlide;

export const addLesson = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
  const {questions, introductions, name} = req.body as {questions:QuestionSlide[], introductions:IntroSlide[], name:string}
  res.end();
};

const createValues = (slides: Slide[]) => {
 const newSlides = slides.map((slide) => {
    if (slide.type === "intro")
      return `(${slide.targetWord},${slide.definition},${slide.slideorder})`;
    else
      return `
        (${slide.question},${slide.correctAnswer},${slide.wrongAnswer1},
        ${slide.wrongAnswer2},${slide.wrongAnswer3},${slide.slideorder},)
        `;
  });

  return newSlides.join(", ")
};
