export class IntroFieldSet extends HTMLElement {
    constructor() {
        super();
        this.connectedCallback = () => { };
        this.disconnectedCallback = () => { };
        this.connectedMoveCallback = () => { };
        this.root = this.attachShadow({ mode: "open" });
        const template = document.getElementById("intro-fieldset");
        this.root.appendChild(template.content.cloneNode(true));
    }
}
export class QuestionFieldSet extends HTMLElement {
    constructor() {
        super();
        this.connectedCallback = () => { };
        this.disconnectedCallback = () => { };
        this.connectedMoveCallback = () => { };
        this.root = this.attachShadow({ mode: "open" });
        const template = document.getElementById("question-fieldset");
        this.root.appendChild(template.content.cloneNode(true));
    }
}
customElements.define("intro-fieldset", IntroFieldSet);
customElements.define("question-fieldset", QuestionFieldSet);
//# sourceMappingURL=FieldSet.js.map