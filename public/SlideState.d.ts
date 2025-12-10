import type { IntroSlideData } from "./IntroSlide.ts";
import type { QuestionSlideData } from "./QuestionSlide.ts";
export type Slide = IntroSlideData | QuestionSlideData;
export type SlideState = {
    changeSlide(nextIndex: number): void;
    setSlides(slides: Slide[]): void;
    getCurrentSlide(): Slide;
    isLastSlide(): boolean;
    getCurrentSlideIndex(): number;
    isFirstSlide(): boolean;
};
export declare const slideState: () => SlideState;
//# sourceMappingURL=SlideState.d.ts.map