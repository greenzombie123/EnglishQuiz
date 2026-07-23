import { lesssonCreaterStore } from "../store/LessonCreaterStore.js";
import "./AudioInputTab.js";
import "./AudioInputRecorder.js";
export default class AudioInput extends HTMLElement {
    constructor() {
        super();
        this.handleChangeInputFile = (event) => {
            const files = event.target.files;
            if (files && files[0]) {
                const audioFiles = this.store.getState("audioFiles");
                const newAudioFiles = [...audioFiles, files[0]];
                this.store.setState("audioFiles", newAudioFiles);
            }
        };
        this.handleAudioFilesChanged = () => {
            const audioFiles = this.store.getState("audioFiles");
            const ul = this.root.querySelector("ul");
            ul.replaceChildren();
            const soundFileNames = this.root.querySelector(".soundFileNames");
            soundFileNames.textContent = `There is ${audioFiles.length} files`;
            audioFiles.forEach((audioFile) => {
                const audioInputTab = document.createElement("audio-input-tab");
                audioInputTab.setAudioUrl(audioFile);
                ul.appendChild(audioInputTab);
            });
        };
        this.handleAudioRecorderButtonClicked = () => {
            const audioInputRecorder = this.root.querySelector("audio-input-recorder");
            audioInputRecorder.open();
        };
        this.root = this.attachShadow({ mode: "closed" });
        const template = document.getElementById("audio-input");
        this.root.appendChild(template.content.cloneNode(true));
        this.inputFileButton = this.root.querySelector("#audio_file_input");
        this.recorderButton = this.root.querySelector("#audio_recorder_button");
        this.addEventListener("change", this.handleChangeInputFile);
        this.inputFileButton.addEventListener("change", this.handleChangeInputFile);
        this.recorderButton.addEventListener("click", this.handleAudioRecorderButtonClicked);
        this.store = lesssonCreaterStore;
        // Subscribe to store events
        this.store.subscribe("audioFilesChanged", this.handleAudioFilesChanged);
    }
    connectedCallback() { }
    disconnectedCallback() { }
    attributeChangedCallback() { }
}
customElements.define("audio-input", AudioInput);
//# sourceMappingURL=AudioInput.js.map