import { lesssonCreaterStore } from "../store/LessonCreaterStore.js";
export default class AudioInputRecorder extends HTMLElement {
    constructor() {
        super();
        this.stream = null;
        this.handleAudioFileCreated = () => { };
        this.root = this.attachShadow({ mode: "closed" });
        const template = document.getElementById("audio-input-recorder");
        this.root.appendChild(template.content.cloneNode(true));
        this.dialog = this.root.querySelector("dialog");
        this.startButton = this.root.querySelector(".start");
        this.stopButton = this.root.querySelector(".stop");
        this.playButton = this.root.querySelector(".play");
        this.name = this.root.querySelector("#name");
        this.finishButton = this.root.querySelector(".finish");
        this.cancelButton = this.root.querySelector(".cancel");
        this.store = lesssonCreaterStore;
        this.store.subscribe("audioFilesChanged", this.handleAudioFileCreated);
    }
    connectedCallback() { }
    async getMedia() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            return true;
        }
        catch (error) {
            this.stream = null;
            console.error(error);
            return false;
        }
    }
    async open() {
        this.dialog.showModal();
        const canUseMedia = await this.getMedia();
        if (!canUseMedia)
            this.dialog.close();
    }
}
customElements.define("audio-input-recorder", AudioInputRecorder);
//# sourceMappingURL=AudioInputRecorder.js.map