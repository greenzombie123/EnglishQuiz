import type { IntroSlideType  } from "./IntroSlide.ts";
import type { QuestionSlideType } from "./QuestionSlide.ts";

export type Slide = IntroSlideType | QuestionSlideType;

export type SlideState = {
  changeSlide(nextIndex: number):void
  setSlides(slides: Slide[]):void
  getCurrentSlide():void
  isLastSlide():boolean
}

export const slideState = ():SlideState => {
  let slides: Slide[];
  let currentSlideIndex: number = 0;

  const isLastSlide = ()=> slides.length + 1 === currentSlideIndex

  const changeSlide = (nextIndex: number) => {
    currentSlideIndex =+ nextIndex
  };

  const setSlides = (newSlides: Slide[]) => {
    slides = newSlides
    console.log(slides)
  };
  const getCurrentSlide = () => {
    return slides[currentSlideIndex] 
  };

  return {
    changeSlide,
    setSlides,
    getCurrentSlide,
    isLastSlide
  };
};