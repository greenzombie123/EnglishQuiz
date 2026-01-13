import "./IntroSlide.js";
import "./QuestionSlide.js";
import "./EndSlide.js";
import { slideState } from "./SlideState.js";
export class LessonSlider extends HTMLElement {
    constructor() {
        super();
        this.root = null;
        this.currentSlide = null;
        this.createSlide = () => {
            const currentSlide = this.slideState.getCurrentSlide();
            const { type } = currentSlide;
            if (type === "intro") {
                return this.createIntroSlide(currentSlide);
            }
            else
                return this.createQuestionSlide(currentSlide);
        };
        this.createIntroSlide = (introSlideData) => {
            const slide = document.createElement(`intro-slide`);
            const isFirstSlide = this.slideState.isFirstSlide();
            slide.setData(introSlideData, isFirstSlide);
            return slide;
        };
        this.createQuestionSlide = (questionSlideData) => {
            const slide = document.createElement(`question-slide`);
            slide.setData(questionSlideData);
            return slide;
        };
        this.removeCurrentSlide = () => {
            if (this.currentSlide) {
                this.currentSlide.remove();
                this.currentSlide = null;
            }
        };
        this.handleWrongAnswer = () => {
            this.slideState.changeSlide(-2);
            this.removeCurrentSlide();
            this.render();
        };
        this.handleCorrectAnswer = () => {
            const isLastSlide = this.slideState.isLastSlide();
            if (isLastSlide)
                return this.handleLessonFinished();
            this.slideState.changeSlide(1);
            this.removeCurrentSlide();
            this.render();
        };
        this.handleNextButtonClicked = () => {
            const isLastSlide = this.slideState.isLastSlide();
            if (isLastSlide)
                return this.handleLessonFinished();
            this.slideState.changeSlide(1);
            this.removeCurrentSlide();
            this.render();
        };
        this.handleLessonFinished = () => {
            this.removeCurrentSlide();
            this.renderEndSlide();
        };
        this.renderEndSlide = () => {
            const endSlide = document.createElement("end-slide");
            if (this.root)
                this.root.appendChild(endSlide);
        };
        this.slideState = slideState();
    }
    connectedCallback() {
        this.root = this.attachShadow({ mode: "closed" });
        const lessonSliderStyle = document.createElement("style");
        lessonSliderStyle.textContent = style;
        this.root.appendChild(lessonSliderStyle);
        this.addEventListener("nextButtonClicked", this.handleNextButtonClicked);
        this.addEventListener("backButtonClicked", () => {
            this.slideState.changeSlide(-1);
            this.removeCurrentSlide();
            this.render();
        });
        this.addEventListener("wrongAnswer", this.handleWrongAnswer);
        this.addEventListener("correctAnswer", this.handleCorrectAnswer);
    }
    disconnectedCallback() { }
    setSlides(slides) {
        this.slideState.setSlides(slides);
    }
    render() {
        this.currentSlide = this.createSlide();
        if (this.root) {
            this.root.appendChild(this.currentSlide);
        }
    }
}
const style = `
  :host{
    flex:1;
}
`;
customElements.define("lesson-slider", LessonSlider);
//# sourceMappingURL=Lesson.js.map