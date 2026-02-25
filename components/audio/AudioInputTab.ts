export default class AudioInputTab extends HTMLElement {
  private root;
  fileName = ""
  static observedAttributes = ["fileName"];

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "closed" });
    const template = document.getElementById(
      "audio-input-tab",
    ) as HTMLTemplateElement;

    this.root.appendChild(template.content.cloneNode(true));
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
   
  }

  connectedCallback(){
    const span = this.root.querySelector("span") as HTMLSpanElement
        span.textContent = this.fileName.slice(0, -4)
  }
}

customElements.define("audio-input-tab", AudioInputTab);
