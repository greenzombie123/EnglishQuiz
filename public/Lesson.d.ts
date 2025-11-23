import "./IntroSlide.ts";
import "./QuestionSlide.ts";
import type { Slide } from "./SlideState.ts";
import { type SlideState } from "./SlideState.ts";
export interface HTMLLessonSlider extends HTMLElement {
    currentSlide: Slide | null;
    slideState: SlideState;
    setSlides(slides: Slide[]): void;
}
export type Lesson = {
    id: number;
    name: string;
    slides: Slide[];
};
export type LessonData = {};
export declare class LessonSlider extends HTMLElement implements HTMLLessonSlider {
    slideState: SlideState;
    currentSlide: null;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    setSlides(slides: Slide[]): void;
}
//# sourceMappingURL=Lesson.d.ts.map