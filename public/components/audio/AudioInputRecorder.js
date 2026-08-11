var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { lesssonCreaterStore } from "../store/LessonCreaterStore.js";
import { LitElement, html, css } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
export default class AudioInputRecorder extends HTMLElement {
    constructor() {
        super();
        this.mimeType = "";
        this.audioFile = null;
        this.handleAudioFileCreated = () => { };
        this.#handleStartRecording = () => {
            if (this.mediaRecorder &&
                this.mediaRecorder.state === "inactive" &&
                this.audio.paused) {
                if (this.audioFile) {
                    URL.revokeObjectURL(this.audioFile.url);
                    this.audioFile = null;
                }
                this.#changeIndicatorColor("recording");
                this.mediaRecorder.start();
            }
        };
        this.#handleStopRecording = () => {
            if (this.mediaRecorder &&
                this.mediaRecorder.state === "recording" &&
                this.audio.paused) {
                this.#changeIndicatorColor("inactive");
                this.mediaRecorder.stop();
            }
        };
        this.#handlePlayRecording = () => {
            if (this.mediaRecorder &&
                this.mediaRecorder.state === "inactive" &&
                this.audioFile) {
                this.audio.src = this.audioFile.url;
                this.audio.play();
                this.#changeIndicatorColor("playing");
            }
        };
        this.#handleUpdateAudioFiles = () => {
            if (!this.audioFile?.file)
                return this.#giveWarning("No file has been recorded yet.");
            if (!this.#hasName())
                return this.#giveWarning("Write the name of the audio file");
            if (!this.#hasNewName())
                return this.#giveWarning("Another audio file has the same name.");
            // Grab the audio files and add the newly recorded one to the array and set as new state
            const audioFiles = this.store.getState("audioFiles");
            const newAudioFile = new File([this.audioFile.file], this.name.value + '.webm', { type: this.audioFile.file.type });
            this.store.setState("audioFiles", [...audioFiles, newAudioFile]);
            this.#handleCloseDialog();
        };
        this.#handleCloseDialog = () => {
            URL.revokeObjectURL(this.audioFile?.url || "");
            this.audioFile = null;
            this.audio.src = "";
            this.name.value = "";
            this.dialog.close();
        };
        this.#handleSetAudioUrl = (event) => {
            this.audioFile = { url: URL.createObjectURL(event.data), file: event.data };
        };
        this.#changeIndicatorColor = (state) => {
            switch (state) {
                case "recording":
                    this.indicator.style.backgroundColor = "red";
                    break;
                case "inactive":
                    this.indicator.style.backgroundColor = "black";
                    break;
                case "playing":
                    this.indicator.style.backgroundColor = "green";
                    break;
                default:
                    break;
            }
        };
        this.#hasName = () => this.name.value !== "";
        this.#hasNewName = () => {
            const audioFilesNames = this.store
                .getState("audioFiles")
                .map((audioFile) => audioFile.name);
            if (!audioFilesNames.length)
                return true;
            return audioFilesNames.some((audioFilesName) => audioFilesName !== this.name.value);
        };
        this.#hasAudioFile = () => this.audioFile !== null;
        this.#giveWarning = (message) => {
            this.warning.textContent = message;
        };
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
        this.indicator = this.root.querySelector(".circle");
        this.audio = this.root.querySelector("audio");
        this.warning = this.root.querySelector(".warning");
        // Add listeners to buttons and inputs
        this.startButton.addEventListener("click", this.#handleStartRecording);
        this.stopButton.addEventListener("click", this.#handleStopRecording);
        this.playButton.addEventListener("click", this.#handlePlayRecording);
        this.audio.addEventListener("ended", () => this.#changeIndicatorColor("inactive"));
        this.cancelButton.addEventListener("click", this.#handleCloseDialog);
        this.finishButton.addEventListener("click", this.#handleUpdateAudioFiles);
        this.store = lesssonCreaterStore;
        this.store.subscribe("audioFilesChanged", this.handleAudioFileCreated);
    }
    connectedCallback() { }
    async getMedia() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mimeType = 'audio/webm;codecs=opus';
            this.mediaRecorder = new MediaRecorder(stream, { mimeType });
            // When the media recorder stops, get the blob from the captured media
            this.mediaRecorder.ondataavailable = this.#handleSetAudioUrl;
            return true;
        }
        catch (error) {
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
    #handleStartRecording;
    #handleStopRecording;
    #handlePlayRecording;
    #handleUpdateAudioFiles;
    #handleCloseDialog;
    #handleSetAudioUrl;
    #changeIndicatorColor;
    #hasName;
    #hasNewName;
    #hasAudioFile;
    #giveWarning;
}
customElements.define("audio-input-recorder", AudioInputRecorder);
let AudioInputRecorderr = class AudioInputRecorderr extends LitElement {
    constructor() {
        super(...arguments);
        this.audioFileNames = [];
        this.name = "";
        this.handleSetAudioFile = (event) => {
            if (!this._audio)
                throw new Error("Something is wrong with the audio");
            this.blob = event.data;
            this._audio.src = URL.createObjectURL(this.blob);
        };
        this.changeIndicatorColor = (state) => {
            if (!this._indicator)
                return;
            switch (state) {
                case "recording":
                    this._indicator.style.backgroundColor = "red";
                    break;
                case "inactive":
                    this._indicator.style.backgroundColor = "black";
                    break;
                case "playing":
                    this._indicator.style.backgroundColor = "green";
                    break;
                default:
                    break;
            }
        };
    }
    static { this.styles = [
        css `
      * {
          box-sizing: border-box;
        }

            dialog{

                .container{
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      gap: 10px;
                      width: 300px;
                      min-height: 120px;

                    .recorder-indicator{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 20px;
                        height: 20px;
                        border: 1px black solid;

                        .circle{
                            width: 8px;
                            height: 8px;
                            border-radius: 5px;
                            background-color: black;
                        }
                    }

                    .recorder-buttons{

                        
                    }

                    input{}

                    bottom-buttons{}
                }
            }
    `
    ]; }
    render() {
        return html `
       <dialog class="audio-input-recorder_dialog">
            <div class="container">
                <span class="recorder-indicator">
                    <span class="circle"></span>
                </span>
                <div class="recorder-buttons">
                    <button type="button" class="start" @click=${this.handleStartRecording}>Start</button>
                    <button type="button" class="stop" @click=${this.handleStopRecording}>Stop</button>
                    <button type="button" class="play" @click=${this.handlePlayRecording}>Play</button>
                </div>
                <label for="name">
                    <input type="text" id="name" @input=${this.handleNameChanged}>
                </label>
                <div class="bottom-buttons">
                    <button type="button" class="finish" @click=${this.handleUpdateAudioFiles}>Finish</button>
                    <button type="button" class="cancel" @click=${this.handleCloseRecorder}>Cancel</button>
                </div>
                <audio></audio>
                <span class="message"></span>
            </div>
        </dialog>
    `;
    }
    isNameNew() {
        const isNameUsed = this.audioFileNames.some(audioFileName => audioFileName === this.name);
        return isNameUsed ? false : true;
    }
    resetRecorderState() {
        this.blob = undefined;
        this.name = "";
        if (this._audio)
            URL.revokeObjectURL(this._audio.src);
        if (this._input)
            this._input.value = "";
    }
    handleCloseRecorder() {
        this.resetRecorderState();
        this._dialog?.close();
    }
    handleUpdateAudioFiles() {
        if (!this.blob)
            return this.showMessage("No recording present. Please make a recording.");
        if (!this.isNameNew())
            return this.showMessage("This name is already being used by another audio file.");
        if (!this.name)
            return this.showMessage("Please enter file's name.");
        const option = {
            bubbles: true,
            composed: true,
            detail: { audioFile: new File([this.blob], this.name + '.webm', { type: this.blob.type }), action: "audioFilesUpdated" }
        };
        this.dispatchEvent(new CustomEvent("stateChanged", option));
        this.handleCloseRecorder();
    }
    showMessage(message) {
        if (this._message) {
            clearTimeout(this.timeOut);
            this._message.textContent = message;
            const clearMessage = () => this._message.textContent = "";
            this.timeOut = setTimeout(() => {
                clearMessage();
            }, 3000);
        }
    }
    async getMedia() {
        try {
            if (!this._audio)
                throw new Error("Can't play recording.");
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mimeType = 'audio/webm;codecs=opus';
            this.mediaRecorder = new MediaRecorder(stream, { mimeType });
            // When the media recorder stops, get the blob from the captured media
            this.mediaRecorder.ondataavailable = this.handleSetAudioFile;
            this._audio.onended = () => this.handleAudioEnded();
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
    handleAudioEnded() {
        this.changeIndicatorColor("inactive");
    }
    async open() {
        if (this._dialog) {
            this._dialog.showModal();
            const canUseMedia = await this.getMedia();
            if (!canUseMedia)
                this._dialog.close();
        }
    }
    handleStartRecording() {
        if (this.mediaRecorder &&
            this.mediaRecorder.state === "inactive" &&
            this._audio &&
            this._audio.paused) {
            if (this.blob)
                URL.revokeObjectURL(this._audio.src);
            this.blob = undefined;
            this.changeIndicatorColor("recording");
            this.mediaRecorder.start();
        }
    }
    handleStopRecording() {
        if (this.mediaRecorder &&
            this.mediaRecorder.state === "recording" &&
            this._audio) {
            this.changeIndicatorColor("inactive");
            this.mediaRecorder.stop();
        }
    }
    handlePlayRecording() {
        if (this.mediaRecorder &&
            this.mediaRecorder.state === "inactive" &&
            this._audio &&
            this.blob) {
            this._audio.play();
            this.changeIndicatorColor("playing");
        }
    }
    handleNameChanged(e) {
        const input = e.target;
        const name = input.value;
        this.name = name;
    }
};
__decorate([
    property({ type: Array })
], AudioInputRecorderr.prototype, "audioFileNames", void 0);
__decorate([
    state()
], AudioInputRecorderr.prototype, "blob", void 0);
__decorate([
    query("dialog")
], AudioInputRecorderr.prototype, "_dialog", void 0);
__decorate([
    query(".circle")
], AudioInputRecorderr.prototype, "_indicator", void 0);
__decorate([
    query("audio")
], AudioInputRecorderr.prototype, "_audio", void 0);
__decorate([
    state()
], AudioInputRecorderr.prototype, "name", void 0);
__decorate([
    query(".message")
], AudioInputRecorderr.prototype, "_message", void 0);
__decorate([
    query("input")
], AudioInputRecorderr.prototype, "_input", void 0);
AudioInputRecorderr = __decorate([
    customElement("audio-input-recorderr")
], AudioInputRecorderr);
export { AudioInputRecorderr };
//# sourceMappingURL=AudioInputRecorder.js.map