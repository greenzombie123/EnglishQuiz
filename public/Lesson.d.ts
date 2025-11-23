import "./IntroSlide.ts";
import "./QuestionSlide.ts";
import type { Slide } from "./SlideState.ts";
export interface HTMLLessonSlider extends HTMLElement {
}
export type Lesson = {
    id: number;
    name: string;
    slides: Slide[];
};
export type LessonData = {};
//# sourceMappingURL=Lesson.d.ts.map