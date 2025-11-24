export class IntroSlide extends HTMLElement {
    constructor() {
        super();
        this.targetWord = "";
        this.definition = "";
        this.root = null;
        this.setData = (introSlideData) => {
            this.targetWord = introSlideData.targetWord;
            this.definition = introSlideData.definition;
        };
    }
    connectedCallback() {
        const template = document.getElementById("intro-slide");
        const templateContent = template.content;
        const clonedContent = templateContent.cloneNode(true);
        this.root = this.attachShadow({ mode: "closed" });
        const targetWord = clonedContent.querySelector(".targetWord");
        const definition = clonedContent.querySelector(".definition");
        const backtButton = clonedContent.querySelector(".next");
        const nextButton = clonedContent.querySelector(".back");
        targetWord.textContent = this.targetWord;
        definition.textContent = this.definition;
        this.root.appendChild(clonedContent);
    }
    disconnectedCallback() { }
}
customElements.define("intro-slide", IntroSlide);
const g = document.createElement("intro-slide");
//# sourceMappingURL=IntroSlide.js.map