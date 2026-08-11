var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { lesssonCreaterStore } from "../store/LessonCreaterStore.js";
import "./AudioInputTab.js";
import "./AudioInputRecorder.js";
import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { removeExtention } from "../../util/util.js";
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
let AudioInputt = class AudioInputt extends LitElement {
    constructor() {
        super(...arguments);
        this.audioFiles = [];
    }
    static { this.styles = [
        css `
       * {
            box-sizing: border-box;
          }

            :host {
                border: black 1px solid;
                padding: 10px;


                .buttons {
                    display: flex;
                    gap: 20px;

                    button {
                        background-image: url("/stop-button.png");
                        background-size: 90%;
                        background-repeat: no-repeat;
                        background-position: center;
                        background-color: white;
                    }

                    label {
                        background-image: url("/upload-big-arrow.png");
                        background-size: 90%;
                        background-repeat: no-repeat;
                        background-position: center;
                    }

                    button,
                    label {
                        border-radius: 4px;
                        height: 30px;
                        width: 30px;
                        padding: 0;
                        margin: 0;
                        appearance: none;
                        border: black solid 1px;
                        cursor: pointer;
                    }

                    input#audio_file_input {
                        display: none;
                    }
                }

                ul{
                    /* margin: 0; */
                    padding: 0;
                }

            }
    `
    ]; }
    render() {
        return html `
      <p>Add an audio file or record a new one.</p>
        <div class="buttons">
            <button id="audio_recorder_button" type="button" @click=${this.recorderClickedHandler}></button>
            <label id="audio_file_input_button" for="audio_file_input">
                <input type="file" name="audio" id="audio_file_input" accept="audio/*">
            </label>
        </div>

        <p class="soundFileNames">No Files Added</p>

        <ul>
          ${this.audioFiles.map(audioFile => html `<audio-input-tabb .audioFile=${audioFile}></audio-input-tabb>`)}
        </ul>

        <audio-input-recorderr .audioFileNames=${this.createAudioFileNames()}></audio-input-recorderr>
    `;
    }
    createAudioFileNames() {
        return this.audioFiles.map(audioFile => removeExtention(audioFile.name));
    }
    recorderClickedHandler() {
        if (this.audioInputRecorder) {
            this.audioInputRecorder.open();
        }
    }
};
__decorate([
    property({ type: Array })
], AudioInputt.prototype, "audioFiles", void 0);
__decorate([
    query("audio-input-recorderr")
], AudioInputt.prototype, "audioInputRecorder", void 0);
AudioInputt = __decorate([
    customElement("audio-inputt")
], AudioInputt);
export { AudioInputt };
//# sourceMappingURL=AudioInput.js.map