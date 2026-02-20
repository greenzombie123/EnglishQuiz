export default class AudioInput extends HTMLElement {
    private root
  
    constructor() {
    super();

    this.root = this.attachShadow({ mode: "closed" });
    const template = document.getElementById(
      "audio-input",
    ) as HTMLTemplateElement;

    this.root.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("audio-input", AudioInput);
