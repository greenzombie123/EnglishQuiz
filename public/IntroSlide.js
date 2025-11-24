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
        // Ref the template, clone content and attach to root
        const templateContent = template.content;
        const clonedContent = templateContent.cloneNode(true);
        this.root = this.attachShadow({ mode: "closed" });
        // Add text toe targetword and definition spans
        const targetWord = clonedContent.querySelector(".targetWord");
        const definition = clonedContent.querySelector(".definition");
        targetWord.textContent = this.targetWord;
        definition.textContent = this.definition;
        // Ref buttons and create event for slider navigation
        const backButton = clonedContent.querySelector(".back");
        const backButtonClicked = new CustomEvent("backButtonClicked", {
            bubbles: true,
            composed: true
        });
        backButton.addEventListener("click", () => {
            this.dispatchEvent(backButtonClicked);
        });
        const nextButton = clonedContent.querySelector(".next");
        const nextButtonClicked = new CustomEvent("nextButtonClicked", {
            bubbles: true,
            composed: true
        });
        nextButton.addEventListener("click", () => {
            this.dispatchEvent(nextButtonClicked);
        });
        this.root.appendChild(clonedContent);
    }
    disconnectedCallback() { }
}
customElements.define("intro-slide", IntroSlide);
//# sourceMappingURL=IntroSlide.js.map