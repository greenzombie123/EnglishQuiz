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
  currentSlide: IntroSlide | QuestionSlide | null;
  root: ShadowRoot | null = null;

  constructor() {
    super();
    this.slideState = slideState();
    this.currentSlide = null;
  }

  connectedCallback() {
    const template = document.getElementById(
      "lesson-slider"
    ) as HTMLTemplateElement;
    const templateContent = template.content;
    const clonedContent = templateContent.cloneNode(true);
    this.root = this.attachShadow({ mode: "closed" });
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
        this.currentSlide = this.createIntroSlide(currentSlide);
      } else if (type === "question") {
        this.currentSlide = this.createQuestionSlide(currentSlide);
      }
    }
  };

  createIntroSlide = (introSlideData: IntroSlideData) => {
    const slide = document.createElement(`intro-slide`) as IntroSlide;
    console.log(slide)
    slide.setData(introSlideData);
    return slide;
  };
  createQuestionSlide = (questionSlideData: QuestionSlideData) => {
    const slide = document.createElement(`question-slide`) as QuestionSlide;
    slide.setData(questionSlideData);
    return slide;
  };

  render() {
    if (this.currentSlide && this.root) this.root.appendChild(this.currentSlide);
  }
}

customElements.define("lesson-slider", LessonSlider);
