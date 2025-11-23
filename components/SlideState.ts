import type { IntroSlideType  } from "./IntroSlide.ts";
import type { QuestionSlideType } from "./QuestionSlide.ts";

export type Slide = IntroSlideType | QuestionSlideType;

export const slideState = () => {
  const slides: Slide[] = [];
  const currentSlideIndex: number | "Finished" = 0;

  const changeSlide = (nextIndex: number) => {};
  const setSlides = (slides: Slide[]) => {};
  const getCurrentSlide = () => {};

  return {
    changeSlide,
    setSlides,
    getCurrentSlide,
  };
};