export class IntroFieldSet extends HTMLElement {
    static formAssociated = true;
    root;
    internals;
    constructor() {
        super();
        this.internals = this.attachInternals();
        this.root = this.attachShadow({ mode: "open" });
        const template = document.getElementById("intro-fieldset");
        this.root.appendChild(template.content.cloneNode(true));
        // this.setAttribute("name", "Squid")
    }
    connectedCallback = () => {
        this.internals.setFormValue("efefe");
    };
    disconnectedCallback = () => { };
    connectedMoveCallback = () => { };
}
export class QuestionFieldSet extends HTMLElement {
    root;
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        const template = document.getElementById("question-fieldset");
        this.root.appendChild(template.content.cloneNode(true));
    }
    connectedCallback = () => { };
    disconnectedCallback = () => { };
    connectedMoveCallback = () => { };
}
customElements.define("intro-fieldset", IntroFieldSet);
customElements.define("question-fieldset", QuestionFieldSet);
//# sourceMappingURL=FieldSet.js.map