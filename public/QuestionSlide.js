export class QuestionSlide extends HTMLElement {
    constructor() {
        super();
        this.correctAnswer = "";
        this.wrongAnswer1 = "";
        this.wrongAnswer2 = "";
        this.wrongAnswer3 = "";
        this.setData = (questionSlideData) => {
            this.correctAnswer = questionSlideData.correctAnswer;
            this.wrongAnswer1 = questionSlideData.wrongAnswer1;
            this.wrongAnswer2 = questionSlideData.wrongAnswer2;
            this.wrongAnswer3 = questionSlideData.wrongAnswer3;
        };
    }
    connectedCallback() {
        const template = document.getElementById("question-slide");
        const templateContent = template.content;
        const clonedContent = templateContent.cloneNode(true);
        const shadowRoot = this.attachShadow({ mode: "closed" });
        shadowRoot.appendChild(clonedContent);
    }
    disconnectedCallback() { }
}
customElements.define("question-slide", QuestionSlide);
//# sourceMappingURL=QuestionSlide.js.map