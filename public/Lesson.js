import "./IntroSlide.js";
import "./QuestionSlide.js";
class Lesson extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        const template = document.getElementById("lesson-slider");
        const templateContent = template.content;
        const clonedContent = templateContent.cloneNode(true);
        const shadowRoot = this.attachShadow({ mode: "closed" });
        shadowRoot.appendChild(clonedContent);
    }
    disconnectedCallback() {
    }
}
customElements.define("lesson-slider", Lesson);
//# sourceMappingURL=Lesson.js.map