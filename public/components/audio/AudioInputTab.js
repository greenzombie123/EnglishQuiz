class AudioInputTab extends HTMLElement {
    constructor() {
        super();
        this.fileName = "";
        this.root = this.attachShadow({ mode: "closed" });
        const template = document.getElementById("audio-input-tab");
        this.root.appendChild(template.content.cloneNode(true));
    }
    attributeChangedCallback(name, oldValue, newValue) {
    }
    connectedCallback() {
        const span = this.root.querySelector("span");
        span.textContent = this.fileName.slice(0, -4);
    }
}
AudioInputTab.observedAttributes = ["fileName"];
export default AudioInputTab;
customElements.define("audio-input-tab", AudioInputTab);
//# sourceMappingURL=AudioInputTab.js.map