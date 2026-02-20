import "./IntroSlide.ts";
import type { IntroSlide } from "./IntroSlide.ts";
import "./QuestionSlide.ts";
import "./EndSlide.ts";
import type { QuestionSlide } from "./QuestionSlide.ts";
import { type SlideState } from "./SlideState.ts";
import type { IntroSlideRecord, QuestionSlideRecord, SlideRecord } from "../shared.types.ts";
export declare class LessonSlider extends HTMLElement {
    slideState: SlideState;
    root: ShadowRoot | null;
    currentSlide: IntroSlide | QuestionSlide | null;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    setSlides(slides: SlideRecord[]): void;
    createSlide: () => IntroSlide | QuestionSlide;
    createIntroSlide: (introSlideData: IntroSlideRecord) => IntroSlide;
    createQuestionSlide: (questionSlideData: QuestionSlideRecord) => QuestionSlide;
    removeCurrentSlide: () => void;
    render(): void;
    handleWrongAnswer: () => void;
    handleCorrectAnswer: () => void;
    handleNextButtonClicked: () => void;
    handleLessonFinished: () => void;
    renderEndSlide: () => void;
}
//# sourceMappingURL=Lesson.d.ts.map