var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { v7 as createId } from "uuid";
let AudioInputRecorder = class AudioInputRecorder extends LitElement {
    constructor() {
        super(...arguments);
        this.fileNames = [];
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
        const isNameUsed = this.fileNames.some(fileName => fileName === this.name);
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
            detail: { recording: { id: createId(), name: this.name, key: createId({}), file: new File([this.blob], this.name, { type: "webm" }), url: "", isNew: true }, action: "audioFilesUpdated" }
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
], AudioInputRecorder.prototype, "fileNames", void 0);
__decorate([
    state()
], AudioInputRecorder.prototype, "blob", void 0);
__decorate([
    query("dialog")
], AudioInputRecorder.prototype, "_dialog", void 0);
__decorate([
    query(".circle")
], AudioInputRecorder.prototype, "_indicator", void 0);
__decorate([
    query("audio")
], AudioInputRecorder.prototype, "_audio", void 0);
__decorate([
    state()
], AudioInputRecorder.prototype, "name", void 0);
__decorate([
    query(".message")
], AudioInputRecorder.prototype, "_message", void 0);
__decorate([
    query("input")
], AudioInputRecorder.prototype, "_input", void 0);
AudioInputRecorder = __decorate([
    customElement("audio-input-recorder")
], AudioInputRecorder);
export { AudioInputRecorder };
//# sourceMappingURL=AudioInputRecorder.js.map