import type { IntroSlideType } from "./IntroSlide.ts";
import type { QuestionSlideType } from "./QuestionSlide.ts";
export type Slide = IntroSlideType | QuestionSlideType;
export type SlideState = {
    changeSlide(nextIndex: number): void;
    setSlides(slides: Slide[]): void;
    getCurrentSlide(): void;
    isLastSlide(): boolean;
};
export declare const slideState: () => SlideState;
//# sourceMappingURL=SlideState.d.ts.map