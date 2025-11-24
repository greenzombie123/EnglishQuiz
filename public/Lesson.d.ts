import "./IntroSlide.ts";
import type { IntroSlide, IntroSlideData } from "./IntroSlide.ts";
import "./QuestionSlide.ts";
import type { QuestionSlide, QuestionSlideData } from "./QuestionSlide.ts";
import type { Slide } from "./SlideState.ts";
import { type SlideState } from "./SlideState.ts";
export type Lesson = {
    id: number;
    name: string;
    slides: Slide[];
};
export type LessonData = {};
export declare class LessonSlider extends HTMLElement {
    slideState: SlideState;
    currentSlide: IntroSlide | QuestionSlide | null;
    root: ShadowRoot | null;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    setSlides(slides: Slide[]): void;
    createSlide: () => void;
    createIntroSlide: (introSlideData: IntroSlideData) => IntroSlide;
    createQuestionSlide: (questionSlideData: QuestionSlideData) => QuestionSlide;
    removeCurrentSlide: () => void;
    render(): void;
}
//# sourceMappingURL=Lesson.d.ts.map