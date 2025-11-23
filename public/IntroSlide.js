class IntroSlide extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        // const template = document.getElementById("lesson-slider") as HTMLTemplateElement
        // const templateContent = template.content
        // const clonedContent = templateContent.cloneNode(true)
        // const shadowRoot = this.attachShadow({mode:"closed"})
        // shadowRoot.appendChild(clonedContent)
    }
    disconnectedCallback() {
    }
}
customElements.define("intro-slide", IntroSlide);
export {};
//# sourceMappingURL=IntroSlide.js.map