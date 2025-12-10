import "./IntroSlide.ts";
import type { IntroSlide, IntroSlideData } from "./IntroSlide.ts";
import "./QuestionSlide.ts";
import "./EndSlide.ts";
import type { QuestionSlide, QuestionSlideData } from "./QuestionSlide.ts";
import type { Slide } from "./SlideState.ts";
import { slideState, type SlideState } from "./SlideState.ts";

export type Lesson = {
  id: number;
  name: string;
  slides: Slide[];
};

export type LessonData = {};

export class LessonSlider extends HTMLElement {
  slideState: SlideState;
  root: ShadowRoot | null = null;
  currentSlide: IntroSlide | QuestionSlide | null = null
  // slider: Node | null = null;

  constructor() {
    super();
    this.slideState = slideState();
  }

  connectedCallback() {
    // const template = document.getElementById(
    //   "lesson-slider"
    // ) as HTMLTemplateElement;
    // const templateContent = template.content;
    // const clonedContent = templateContent.cloneNode(true);
    this.root = this.attachShadow({ mode: "closed" });

    this.addEventListener("nextButtonClicked", this.handleNextButtonClicked);

    this.addEventListener("backButtonClicked", () => {
      this.slideState.changeSlide(-1);
      this.removeCurrentSlide();
      this.render();
    });

    this.addEventListener("wrongAnswer", this.handleWrongAnswer);

    this.addEventListener("correctAnswer", this.handleCorrectAnswer);

    // this.root.appendChild(clonedContent);
  }

  disconnectedCallback() {}

  setSlides(slides: Slide[]): void {
    this.slideState.setSlides(slides);
    //! Is this necessary?
    // this.createSlide();
  }

  createSlide = () => {
    const currentSlide = this.slideState.getCurrentSlide();
    // if (currentSlide) {
      const { type } = currentSlide;
      if (type === "intro") {
        return this.createIntroSlide(currentSlide);
      } else //if (type === "question") {
        return this.createQuestionSlide(currentSlide);
      }
  

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
      // const lessonSlider = this.root.querySelector(".lesson-slider");
      this.root.textContent = null;
    }
  };

  render() {
    this.currentSlide = this.createSlide();
    if (this.root) {
      // const slider = this.root.querySelector(".lesson-slider");
      this.root.appendChild(this.currentSlide);
    }
  }

  handleWrongAnswer = () => {
    this.slideState.changeSlide(-2);
    this.removeCurrentSlide();
    this.render();
  };

  handleCorrectAnswer = () => {
    const isLastSlide = this.slideState.isLastSlide();
    if (isLastSlide) return this.handleLessonFinished();
    this.slideState.changeSlide(1);
    this.removeCurrentSlide();
    this.render();
  };

  handleNextButtonClicked = () => {
    const isLastSlide = this.slideState.isLastSlide();
    if (isLastSlide) return this.handleLessonFinished();
    this.slideState.changeSlide(1);
    this.removeCurrentSlide();
    this.render();
  };

  handleLessonFinished = () => {
    this.removeCurrentSlide();
    this.renderEndSlide();
  };

  renderEndSlide = () => {
    const endSlide = document.createElement("end-slide");
    if (this.root) this.root.appendChild(endSlide);
  };
}

customElements.define("lesson-slider", LessonSlider);
