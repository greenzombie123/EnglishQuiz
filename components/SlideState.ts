import type { IntroSlideData } from "./IntroSlide.ts";
import type { QuestionSlideData } from "./QuestionSlide.ts";

export type Slide = IntroSlideData | QuestionSlideData;

export type SlideState = {
  changeSlide(nextIndex: number): void;
  setSlides(slides: Slide[]): void;
  getCurrentSlide(): Slide | null;
  isLastSlide(): boolean;
  getCurrentSlideIndex():number
};

export const slideState = (): SlideState => {
  let slides: Slide[];
  let currentSlideIndex: number = 0;

  const isLastSlide = () => slides.length + 1 === currentSlideIndex;

  const changeSlide = (nextIndex: number) => {
    currentSlideIndex = +nextIndex;
  };

  const setSlides = (newSlides: Slide[]) => {
    slides = newSlides;
  };

  const getCurrentSlide = () => slides[currentSlideIndex] || null;

  const getCurrentSlideIndex = ()=>currentSlideIndex

  return {
    changeSlide,
    setSlides,
    getCurrentSlide,
    isLastSlide,
    getCurrentSlideIndex
  };
};
