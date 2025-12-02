export class IntroFieldSet extends HTMLElement {
  root;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    const template = document.getElementById(
      "intro-fieldset"
    ) as HTMLTemplateElement;

    this.root.appendChild(template.content.cloneNode(true));
  }

  connectedCallback = () => {};

  disconnectedCallback = () => {};

  connectedMoveCallback = () => {};
}

export class QuestionFieldSet extends HTMLElement {
  root;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    const template = document.getElementById(
      "question-fieldset"
    ) as HTMLTemplateElement;

    this.root.appendChild(template.content.cloneNode(true));
  }

  connectedCallback = () => {};

  disconnectedCallback = () => {};

  connectedMoveCallback = () => {};
}

customElements.define("intro-fieldset", IntroFieldSet);
customElements.define("question-fieldset", QuestionFieldSet);
