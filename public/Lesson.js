import "./IntroSlide.js";
import "./QuestionSlide.js";
import { slideState } from "./SlideState.js";
export class LessonSlider extends HTMLElement {
    constructor() {
        super();
        this.currentSlide = null;
        this.slideState = slideState();
        this.currentSlide;
    }
    connectedCallback() {
        const template = document.getElementById("lesson-slider");
        const templateContent = template.content;
        const clonedContent = templateContent.cloneNode(true);
        const shadowRoot = this.attachShadow({ mode: "closed" });
        shadowRoot.appendChild(clonedContent);
    }
    disconnectedCallback() { }
    setSlides(slides) {
        this.slideState.setSlides(slides);
    }
}
customElements.define("lesson-slider", LessonSlider);
//# sourceMappingURL=Lesson.js.map