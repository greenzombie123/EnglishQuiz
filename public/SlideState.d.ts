import type { IntroSlideType } from "./IntroSlide.ts";
import type { QuestionSlideType } from "./QuestionSlide.ts";
export type Slide = IntroSlideType | QuestionSlideType;
export declare const slideState: () => {
    changeSlide: (nextIndex: number) => void;
    setSlides: (slides: Slide[]) => void;
    getCurrentSlide: () => void;
};
//# sourceMappingURL=SlideState.d.ts.map