import "./IntroSlide.js";
import "./QuestionSlide.js";
import "./EndSlide.js";
import { slideState } from "./SlideState.js";
export class LessonSlider extends HTMLElement {
    // slider: Node | null = null;
    constructor() {
        super();
        this.root = null;
        this.currentSlide = null;
        this.createSlide = () => {
            const currentSlide = this.slideState.getCurrentSlide();
            // if (currentSlide) {
            const { type } = currentSlide;
            if (type === "intro") {
                return this.createIntroSlide(currentSlide);
            }
            else //if (type === "question") {
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
            if (this.root) {
                // const lessonSlider = this.root.querySelector(".lesson-slider");
                this.root.textContent = null;
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
    disconnectedCallback() { }
    setSlides(slides) {
        this.slideState.setSlides(slides);
        //! Is this necessary?
        // this.createSlide();
    }
    render() {
        this.currentSlide = this.createSlide();
        if (this.root) {
            // const slider = this.root.querySelector(".lesson-slider");
            this.root.appendChild(this.currentSlide);
        }
    }
}
customElements.define("lesson-slider", LessonSlider);
//# sourceMappingURL=Lesson.js.map