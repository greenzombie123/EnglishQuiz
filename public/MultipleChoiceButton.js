;
export class MultiChoiceButton extends HTMLElement {
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
customElements.define("multichoice-button", MultiChoiceButton);
//# sourceMappingURL=MultipleChoiceButton.js.map