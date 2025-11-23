import "./IntroSlide.ts";
import type { IntroSlideType } from "./IntroSlide.ts";
import type { MultiChoiceButtonBase } from "./MultipleChoiceButton.ts";
import "./QuestionSlide.ts";
import type { QuestionSlideType } from "./QuestionSlide.ts";
import type { Slide } from "./SlideState.ts";
import { slideState, type SlideState } from "./SlideState.ts";

export interface HTMLLessonSlider extends HTMLElement {
  currentSlide: Slide | null;
  slideState: SlideState;
  setSlides(slides: Slide[]): void;
  //   checkAnswer(): void;
  //   changeCurrentSlide(slide: Slide[]): void;
  //   render(): void;
  //   handleNextSlide(button: HTMLButtonElement): void;
  //   handleCorrectAnswer(button: MultiChoiceButtonBase): void;
  //   handleWrongAnswer(): void;
  //   handleMultiButtonClicked(button: MultiChoiceButtonBase): void;
}

export type Lesson = {
  id: number;
  name: string;
  slides: Slide[];
};

export type LessonData = {};

export class LessonSlider extends HTMLElement implements HTMLLessonSlider {
  slideState;
  currentSlide = null;

  constructor() {
    super();
    this.slideState = slideState();
    this.currentSlide;
  }

  connectedCallback() {
    const template = document.getElementById(
      "lesson-slider"
    ) as HTMLTemplateElement;
    const templateContent = template.content;
    const clonedContent = templateContent.cloneNode(true);
    const shadowRoot = this.attachShadow({ mode: "closed" });
    shadowRoot.appendChild(clonedContent);
  }

  disconnectedCallback() {}

  setSlides(slides: Slide[]): void {
    this.slideState.setSlides(slides)
  }
}

customElements.define("lesson-slider", LessonSlider);

