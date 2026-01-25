import type { SlideRecord } from "../shared.types.ts";

export type SlideState = {
  changeSlide(nextIndex: number): void;
  setSlides(slides: SlideRecord[]): void;
  getCurrentSlide(): SlideRecord;
  isLastSlide(): boolean;
  getCurrentSlideIndex():number
  isFirstSlide():boolean
};

export const slideState = (): SlideState => {
  let slides: SlideRecord[];
  let currentSlideIndex: number = 0;

  const isFirstSlide = ()=> currentSlideIndex === 0

  const isLastSlide = () => slides.length - 1 === currentSlideIndex;

  const changeSlide = (nextIndex: number) => {
    currentSlideIndex += nextIndex;
    if(currentSlideIndex < 0) currentSlideIndex = 0
  };

  const setSlides = (newSlides: SlideRecord[]) => {
    slides = newSlides;
  };

  const getCurrentSlide = () => slides[currentSlideIndex]!;

  const getCurrentSlideIndex = ()=>currentSlideIndex

  return {
    changeSlide,
    setSlides,
    getCurrentSlide,
    isLastSlide,
    getCurrentSlideIndex,
    isFirstSlide
  };
};
