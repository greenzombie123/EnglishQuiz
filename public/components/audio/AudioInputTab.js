var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { removeExtention } from "../../util/util.js";
import { lesssonCreaterStore } from "../store/LessonCreaterStore.js";
import "../utility/PopUpModal.js";
import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
export default class AudioInputTab extends HTMLElement {
    static { this.observedAttributes = ["fileName"]; }
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
customElements.define("audio-input-tab", AudioInputTab);
let AudioInputTabb = class AudioInputTabb extends LitElement {
    static { this.styles = [
        css `
      * {
                box-sizing: border-box;
            }


            div {
                display: flex;
                padding: 5px;
                gap: 10px;

                border: 1px solid black;
                
                span{
                    margin-right: auto;
                }

                button{
                    width: 20px;
                    height: 20px;
                }
            }
    `
    ]; }
    tabTemplate() {
        if (!this.audioFile)
            throw new Error("Expected an audio file but was not found");
        this.blobUrl = URL.createObjectURL(this.audioFile);
        this.fileName = removeExtention(this.audioFile.name);
        return html `
       <div class="audio_input_tab">
            <span>${this.fileName}</span>
            <!-- Add images later -->
            <button type="button" class="play" @click=${this.handlePlayAudio}>P</button>
            <button type="button" class="delete" @click=${this.handleDeleteAudio}>D</button>
            <audio src=${this.blobUrl}></audio>
       </div>
    `;
    }
    render() {
        return this.tabTemplate();
    }
    disconnectedCallback() {
        if (this.blobUrl)
            URL.revokeObjectURL(this.blobUrl);
    }
    handlePlayAudio() {
        if (!this._audio)
            throw new Error("Audio was not found");
        this._audio.play();
    }
    handleDeleteAudio() {
        const init = {
            bubbles: true,
            composed: true,
            detail: { action: "audioFileDeleted", name: this.fileName }
        };
        this.dispatchEvent(new CustomEvent("stateChanged", init));
    }
};
__decorate([
    property({ type: Object })
], AudioInputTabb.prototype, "audioFile", void 0);
__decorate([
    query("audio")
], AudioInputTabb.prototype, "_audio", void 0);
AudioInputTabb = __decorate([
    customElement("audio-input-tabb")
], AudioInputTabb);
export { AudioInputTabb };
//# sourceMappingURL=AudioInputTab.js.map