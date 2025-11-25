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
    root: ShadowRoot | null;
    slider: Node | null;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    setSlides(slides: Slide[]): void;
    createSlide: () => IntroSlide | QuestionSlide | undefined;
    createIntroSlide: (introSlideData: IntroSlideData) => IntroSlide;
    createQuestionSlide: (questionSlideData: QuestionSlideData) => QuestionSlide;
    removeCurrentSlide: () => void;
    render(): void;
    handleWrongAnswer: () => void;
    handleCorrectAnswer: () => void;
}
//# sourceMappingURL=Lesson.d.ts.map