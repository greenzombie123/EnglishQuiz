export class IntroSlide extends HTMLElement {
    constructor() {
        super();
        this.targetWord = "";
        this.definition = "";
        this.isFirstSlide = false;
        this.root = null;
        this.setData = (introSlideData, isFirstSlide) => {
            this.targetWord = introSlideData.targetword;
            this.definition = introSlideData.definition;
            this.isFirstSlide = isFirstSlide;
        };
    }
    connectedCallback() {
        const template = document.getElementById("intro-slide");
        // Ref the template, clone content and attach to root
        const templateContent = template.content;
        const clonedContent = templateContent.cloneNode(true);
        this.root = this.attachShadow({ mode: "closed" });
        // Add text to targetword and definition spans
        const targetWord = clonedContent.querySelector(".targetWord");
        const definition = clonedContent.querySelector(".definition");
        targetWord.textContent = this.targetWord;
        definition.textContent = this.definition;
        // Ref buttons and create event for slider navigation
        const backButton = clonedContent.querySelector(".back");
        const backButtonClicked = new CustomEvent("backButtonClicked", {
            bubbles: true,
            composed: true,
        });
        backButton.addEventListener("click", () => {
            this.dispatchEvent(backButtonClicked);
        });
        // Only display back button if the slide is not the first slide of the lesson
        if (this.isFirstSlide)
            backButton.style.display = "none";
        const nextButton = clonedContent.querySelector(".next");
        // Need to pass an object to allow the event to not only bubble up and but also leave out of shadow root
        const nextButtonClicked = new CustomEvent("nextButtonClicked", {
            bubbles: true,
            composed: true,
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