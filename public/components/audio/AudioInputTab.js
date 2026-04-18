import { lesssonCreaterStore } from "../store/LessonCreaterStore.js";
import "../utility/PopUpModal.js";
class AudioInputTab extends HTMLElement {
    constructor() {
        super();
        this.audioFile = null;
        this.handleDeleteButtonClicked = () => {
            const popUpModal = document.createElement("pop-up-modal");
            const topMessage = `Delete this audio file?`;
            const bottomMessage = `${this.audioFile ? this.audioFile.name : ""}`;
            this.root.appendChild(popUpModal);
            popUpModal.showPopUpModal(topMessage, bottomMessage, this.handleRemoveAudioFile);
        };
        this.handleRemoveAudioFile = () => {
            if (!this.audioFile)
                return Error("No audio file was set");
            const audioFiles = this.store.getState("audioFiles");
            const deletingAudioFile = this.audioFile;
            const newAudioFiles = audioFiles.filter((audioFile) => audioFile.name !== deletingAudioFile.name);
            this.store.setState("audioFiles", newAudioFiles);
        };
        this.root = this.attachShadow({ mode: "closed" });
        const template = document.getElementById("audio-input-tab");
        this.root.appendChild(template.content.cloneNode(true));
        this.audio = this.root.querySelector("audio");
        this.store = lesssonCreaterStore;
    }
    attributeChangedCallback(name, oldValue, newValue) { }
    connectedCallback() {
        if (!this.audioFile)
            return Error("No audio file was set");
        const url = URL.createObjectURL(this.audioFile);
        this.audio.src = url;
        const span = this.root.querySelector("span");
        span.textContent = this.audioFile.name;
        const playButton = this.root.querySelector(".play");
        const deleteButton = this.root.querySelector(".delete");
        playButton.addEventListener("click", () => {
            this.audio.play();
        });
        deleteButton.addEventListener("click", this.handleDeleteButtonClicked);
    }
    setAudioUrl(file) {
        this.audioFile = file;
    }
}
AudioInputTab.observedAttributes = ["fileName"];
export default AudioInputTab;
customElements.define("audio-input-tab", AudioInputTab);
//# sourceMappingURL=AudioInputTab.js.map