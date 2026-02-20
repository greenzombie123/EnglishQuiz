export default class AudioInput extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "closed" });
        const template = document.getElementById("audio-input");
        this.root.appendChild(template.content.cloneNode(true));
    }
}
customElements.define("audio-input", AudioInput);
//# sourceMappingURL=AudioInput.js.map