import "./IntroSlide.js";
import "./QuestionSlide.js";
import { slideState } from "./SlideState.js";
export class LessonSlider extends HTMLElement {
    constructor() {
        super();
        this.root = null;
        this.slider = null;
        this.createSlide = () => {
            const currentSlide = this.slideState.getCurrentSlide();
            if (currentSlide) {
                const { type } = currentSlide;
                if (type === "intro") {
                    return this.createIntroSlide(currentSlide);
                }
                else if (type === "question") {
                    return this.createQuestionSlide(currentSlide);
                }
            }
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
                const lessonSlider = this.root.querySelector(".lesson-slider");
                if (lessonSlider)
                    lessonSlider.textContent = null;
            }
        };
        this.handleWrongAnswer = () => {
            console.log('WRONG!');
        };
        this.handleCorrectAnswer = () => { };
        this.slideState = slideState();
    }
    connectedCallback() {
        const template = document.getElementById("lesson-slider");
        const templateContent = template.content;
        const clonedContent = templateContent.cloneNode(true);
        this.root = this.attachShadow({ mode: "closed" });
        this.addEventListener("nextButtonClicked", () => {
            const isLastSlide = this.slideState.isLastSlide();
            if (isLastSlide)
                return;
            this.slideState.changeSlide(1);
            this.removeCurrentSlide();
            this.render();
        });
        this.addEventListener("backButtonClicked", () => {
            this.slideState.changeSlide(-1);
            this.removeCurrentSlide();
            this.render();
        });
        this.addEventListener("wrongAnswer", () => {
            console.log(100000);
        });
        // this.addEventListener("correctAnswer")
        this.root.appendChild(clonedContent);
    }
    disconnectedCallback() { }
    setSlides(slides) {
        this.slideState.setSlides(slides);
        this.createSlide();
    }
    render() {
        const slide = this.createSlide();
        if (this.root && slide) {
            const slider = this.root.querySelector(".lesson-slider");
            if (slider)
                slider.appendChild(slide);
        }
    }
}
customElements.define("lesson-slider", LessonSlider);
//# sourceMappingURL=Lesson.js.map