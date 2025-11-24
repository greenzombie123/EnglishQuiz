import "./IntroSlide.ts";
import type { IntroSlide, IntroSlideData } from "./IntroSlide.ts";
import type { MultiChoiceButtonBase } from "./MultipleChoiceButton.ts";
import "./QuestionSlide.ts";
import type { QuestionSlide, QuestionSlideData } from "./QuestionSlide.ts";
import type { Slide } from "./SlideState.ts";
import { slideState, type SlideState } from "./SlideState.ts";

// export interface HTMLLessonSlider extends HTMLElement {
//   currentSlide: Slide | null;
//   slideState: SlideState;
//   setSlides(slides: Slide[]): void;
//   //   checkAnswer(): void;
//   //   changeCurrentSlide(slide: Slide[]): void;
//   //   render(): void;
//   //   handleNextSlide(button: HTMLButtonElement): void;
//   //   handleCorrectAnswer(button: MultiChoiceButtonBase): void;
//   //   handleWrongAnswer(): void;
//   //   handleMultiButtonClicked(button: MultiChoiceButtonBase): void;
// }

export type Lesson = {
  id: number;
  name: string;
  slides: Slide[];
};

export type LessonData = {};

export class LessonSlider extends HTMLElement {
  slideState: SlideState;
  root: ShadowRoot | null = null;
  slider: Node | null = null;

  constructor() {
    super();
    this.slideState = slideState();
  }

  connectedCallback() {
    const template = document.getElementById(
      "lesson-slider"
    ) as HTMLTemplateElement;
    const templateContent = template.content;
    const clonedContent = templateContent.cloneNode(true);
    this.root = this.attachShadow({ mode: "closed" });

    this.addEventListener("nextButtonClicked", () => {
      const isLastSlide = this.slideState.isLastSlide();
      if (isLastSlide) return;
      this.slideState.changeSlide(1);
      this.removeCurrentSlide();
      this.render();
    });

    this.addEventListener("backButtonClicked", () => {
      this.slideState.changeSlide(-1);
      this.removeCurrentSlide();
      this.render();
    });

    this.root.appendChild(clonedContent);
  }

  disconnectedCallback() {}

  setSlides(slides: Slide[]): void {
    this.slideState.setSlides(slides);
    this.createSlide();
  }

  createSlide = () => {
    const currentSlide = this.slideState.getCurrentSlide();
    if (currentSlide) {
      const { type } = currentSlide;
      if (type === "intro") {
        return this.createIntroSlide(currentSlide);
      } else if (type === "question") {
        return this.createQuestionSlide(currentSlide);
      }
    }
  };

  createIntroSlide = (introSlideData: IntroSlideData) => {
    const slide = document.createElement(`intro-slide`) as IntroSlide;
    const isFirstSlide = this.slideState.isFirstSlide();
    slide.setData(introSlideData, isFirstSlide);
    return slide;
  };

  createQuestionSlide = (questionSlideData: QuestionSlideData) => {
    const slide = document.createElement(`question-slide`) as QuestionSlide;
    slide.setData(questionSlideData);
    return slide;
  };

  removeCurrentSlide = () => {
    if (this.root) {
      const lessonSlider = this.root.querySelector(".lesson-slider");
      if (lessonSlider) lessonSlider.textContent = null;
    }
  };

  render() {
    const slide = this.createSlide();
    if (this.root && slide) {
      const slider = this.root.querySelector(".lesson-slider");
      if (slider) slider.appendChild(slide);
    }
  }
}

customElements.define("lesson-slider", LessonSlider);
