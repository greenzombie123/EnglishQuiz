import "./IntroSlide.ts";
import type { IntroSlide } from "./IntroSlide.ts";
import "./QuestionSlide.ts";
import "./EndSlide.ts";
import type { QuestionSlide } from "./QuestionSlide.ts";
import { slideState, type SlideState } from "./SlideState.ts";
import type { IntroSlideRecord, QuestionSlideRecord, SlideRecord } from "../shared.types.ts";

export class LessonSlider extends HTMLElement {
  slideState: SlideState;
  root: ShadowRoot | null = null;
  currentSlide: IntroSlide | QuestionSlide | null = null;

  constructor() {
    super();
    this.slideState = slideState();
  }

  connectedCallback() {
    this.root = this.attachShadow({ mode: "closed" });

    const lessonSliderStyle = document.createElement("style") as HTMLStyleElement
    lessonSliderStyle.textContent = style
    this.root.appendChild(lessonSliderStyle)

    this.addEventListener("nextButtonClicked", this.handleNextButtonClicked);

    this.addEventListener("backButtonClicked", () => {
      this.slideState.changeSlide(-1);
      this.removeCurrentSlide();
      this.render();
    });

    this.addEventListener("wrongAnswer", this.handleWrongAnswer);

    this.addEventListener("correctAnswer", this.handleCorrectAnswer);
  }

  disconnectedCallback() {}

  setSlides(slides: SlideRecord[]): void {
    this.slideState.setSlides(slides);
  }

  createSlide = () => {
    const currentSlide = this.slideState.getCurrentSlide();
    const { type } = currentSlide;
    if (type === "intro") {
      return this.createIntroSlide(currentSlide);
    } 
    else return this.createQuestionSlide(currentSlide);
  };

  createIntroSlide = (introSlideData: IntroSlideRecord) => {
    const slide = document.createElement(`intro-slide`) as IntroSlide;
    const isFirstSlide = this.slideState.isFirstSlide();
    slide.setData(introSlideData, isFirstSlide);
    return slide;
  };

  createQuestionSlide = (questionSlideData: QuestionSlideRecord) => {
    const slide = document.createElement(`question-slide`) as QuestionSlide;
    slide.setData(questionSlideData);
    return slide;
  };

  removeCurrentSlide = () => {
    if (this.currentSlide) {
      this.currentSlide.remove();
      this.currentSlide = null;
    }
  };

  render() {
    this.currentSlide = this.createSlide();
    if (this.root) {
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

const style = `
  :host{
    flex:1;
}
`

customElements.define("lesson-slider", LessonSlider);
