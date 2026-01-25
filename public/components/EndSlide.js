export class EndSlide extends HTMLElement {
    constructor() {
        super();
        this.root = null;
    }
    connectedCallback() {
        const template = document.getElementById("end-slide");
        // Ref the template, clone content and attach to root
        const templateContent = template.content;
        const clonedContent = templateContent.cloneNode(true);
        this.root = this.attachShadow({ mode: "closed" });
        // Get button
        const button = clonedContent.querySelector(".button");
        this.root.appendChild(clonedContent);
    }
    disconnectedCallback() { }
}
customElements.define("end-slide", EndSlide);
//# sourceMappingURL=EndSlide.js.map