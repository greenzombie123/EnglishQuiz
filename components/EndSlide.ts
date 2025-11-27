export type EndSlideData = {
  type: "end";
};

export class EndSlide extends HTMLElement {
  root: ShadowRoot | null = null;

  constructor() {
    super();
  }

  connectedCallback() {
    const template = document.getElementById(
      "end-slide"
    ) as HTMLTemplateElement;

    // Ref the template, clone content and attach to root
    const templateContent = template.content;

    const clonedContent = templateContent.cloneNode(true) as DocumentFragment;

    this.root = this.attachShadow({ mode: "closed" });

    // Get button
    const button = clonedContent.querySelector(
      ".button"
    ) as HTMLButtonElement;


    this.root.appendChild(clonedContent);
  }

  disconnectedCallback() {}
}

customElements.define("end-slide", EndSlide);
