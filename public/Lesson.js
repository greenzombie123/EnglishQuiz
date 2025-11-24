import "./IntroSlide.js";
import "./QuestionSlide.js";
import { slideState } from "./SlideState.js";
export class LessonSlider extends HTMLElement {
    constructor() {
        super();
        this.root = null;
        this.createSlide = () => {
            const currentSlide = this.slideState.getCurrentSlide();
            if (currentSlide) {
                const { type } = currentSlide;
                if (type === "intro") {
                    this.currentSlide = this.createIntroSlide(currentSlide);
                }
                else if (type === "question") {
                    this.currentSlide = this.createQuestionSlide(currentSlide);
                }
            }
        };
        this.createIntroSlide = (introSlideData) => {
            const slide = document.createElement(`intro-slide`);
            console.log(slide);
            slide.setData(introSlideData);
            return slide;
        };
        this.createQuestionSlide = (questionSlideData) => {
            const slide = document.createElement(`question-slide`);
            slide.setData(questionSlideData);
            return slide;
        };
        this.removeCurrentSlide = () => {
            if (this.currentSlide && this.root)
                this.root.removeChild(this.currentSlide);
        };
        this.slideState = slideState();
        this.currentSlide = null;
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
            this.createSlide();
            this.render();
        });
        this.addEventListener("backButtonClicked", () => {
            console.log(23213123);
        });
        this.root.appendChild(clonedContent);
    }
    disconnectedCallback() { }
    setSlides(slides) {
        this.slideState.setSlides(slides);
        this.createSlide();
    }
    render() {
        if (this.currentSlide && this.root)
            this.root.appendChild(this.currentSlide);
    }
}
customElements.define("lesson-slider", LessonSlider);
//# sourceMappingURL=Lesson.js.map