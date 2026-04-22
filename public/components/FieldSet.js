"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionFieldSet = exports.IntroFieldSet = void 0;
class IntroFieldSet extends HTMLElement {
    constructor() {
        super();
        this.connectedCallback = () => {
            this.internals.setFormValue("efefe");
        };
        this.disconnectedCallback = () => { };
        this.connectedMoveCallback = () => { };
        this.internals = this.attachInternals();
        this.root = this.attachShadow({ mode: "open" });
        const template = document.getElementById("intro-fieldset");
        this.root.appendChild(template.content.cloneNode(true));
        // this.setAttribute("name", "Squid")
    }
}
exports.IntroFieldSet = IntroFieldSet;
IntroFieldSet.formAssociated = true;
class QuestionFieldSet extends HTMLElement {
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
exports.QuestionFieldSet = QuestionFieldSet;
customElements.define("intro-fieldset", IntroFieldSet);
customElements.define("question-fieldset", QuestionFieldSet);
//# sourceMappingURL=FieldSet.js.map