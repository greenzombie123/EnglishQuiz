"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionFieldSet = exports.IntroFieldSet = void 0;
class IntroFieldSet extends HTMLElement {
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
exports.IntroFieldSet = IntroFieldSet;
class QuestionFieldSet extends HTMLElement {
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
exports.QuestionFieldSet = QuestionFieldSet;
customElements.define("intro-fieldset", IntroFieldSet);
customElements.define("question-fieldset", QuestionFieldSet);
//# sourceMappingURL=FieldSet.js.map