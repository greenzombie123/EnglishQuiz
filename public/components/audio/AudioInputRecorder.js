var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AudioInputRecorder_handleStartRecording, _AudioInputRecorder_handleStopRecording, _AudioInputRecorder_handlePlayRecording, _AudioInputRecorder_handleUpdateAudioFiles, _AudioInputRecorder_handleCloseDialog, _AudioInputRecorder_handleSetAudioUrl, _AudioInputRecorder_changeIndicatorColor, _AudioInputRecorder_hasName, _AudioInputRecorder_hasNewName, _AudioInputRecorder_hasAudioFile, _AudioInputRecorder_giveWarning;
import { lesssonCreaterStore } from "../store/LessonCreaterStore.js";
class AudioInputRecorder extends HTMLElement {
    constructor() {
        super();
        this.mimeType = "";
        this.audioFile = null;
        this.handleAudioFileCreated = () => { };
        _AudioInputRecorder_handleStartRecording.set(this, () => {
            if (this.mediaRecorder &&
                this.mediaRecorder.state === "inactive" &&
                this.audio.paused) {
                if (this.audioFile) {
                    URL.revokeObjectURL(this.audioFile.url);
                    this.audioFile = null;
                }
                __classPrivateFieldGet(this, _AudioInputRecorder_changeIndicatorColor, "f").call(this, "recording");
                this.mediaRecorder.start();
            }
        });
        _AudioInputRecorder_handleStopRecording.set(this, () => {
            if (this.mediaRecorder &&
                this.mediaRecorder.state === "recording" &&
                this.audio.paused) {
                __classPrivateFieldGet(this, _AudioInputRecorder_changeIndicatorColor, "f").call(this, "inactive");
                this.mediaRecorder.stop();
            }
        });
        _AudioInputRecorder_handlePlayRecording.set(this, () => {
            if (this.mediaRecorder &&
                this.mediaRecorder.state === "inactive" &&
                this.audioFile) {
                this.audio.src = this.audioFile.url;
                this.audio.play();
                __classPrivateFieldGet(this, _AudioInputRecorder_changeIndicatorColor, "f").call(this, "playing");
            }
        });
        _AudioInputRecorder_handleUpdateAudioFiles.set(this, () => {
            var _a;
            if (!((_a = this.audioFile) === null || _a === void 0 ? void 0 : _a.file))
                return __classPrivateFieldGet(this, _AudioInputRecorder_giveWarning, "f").call(this, "No file has been recorded yet.");
            if (!__classPrivateFieldGet(this, _AudioInputRecorder_hasName, "f").call(this))
                return __classPrivateFieldGet(this, _AudioInputRecorder_giveWarning, "f").call(this, "Write the name of the audio file");
            if (!__classPrivateFieldGet(this, _AudioInputRecorder_hasNewName, "f").call(this))
                return __classPrivateFieldGet(this, _AudioInputRecorder_giveWarning, "f").call(this, "Another audio file has the same name.");
            // Grab the audio files and add the newly recorded one to the array and set as new state
            const audioFiles = this.store.getState("audioFiles");
            const newAudioFile = new File([this.audioFile.file], this.name.value + '.webm', { type: this.audioFile.file.type });
            console.log(newAudioFile.name);
            this.store.setState("audioFiles", [...audioFiles, newAudioFile]);
            __classPrivateFieldGet(this, _AudioInputRecorder_handleCloseDialog, "f").call(this);
        });
        _AudioInputRecorder_handleCloseDialog.set(this, () => {
            var _a;
            URL.revokeObjectURL(((_a = this.audioFile) === null || _a === void 0 ? void 0 : _a.url) || "");
            this.audioFile = null;
            this.audio.src = "";
            this.name.value = "";
            this.dialog.close();
        });
        _AudioInputRecorder_handleSetAudioUrl.set(this, (event) => {
            this.audioFile = { url: URL.createObjectURL(event.data), file: event.data };
        });
        _AudioInputRecorder_changeIndicatorColor.set(this, (state) => {
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
        });
        _AudioInputRecorder_hasName.set(this, () => this.name.value !== "");
        _AudioInputRecorder_hasNewName.set(this, () => {
            const audioFilesNames = this.store
                .getState("audioFiles")
                .map((audioFile) => audioFile.name);
            if (!audioFilesNames.length)
                return true;
            return audioFilesNames.some((audioFilesName) => audioFilesName !== this.name.value);
        });
        _AudioInputRecorder_hasAudioFile.set(this, () => this.audioFile !== null);
        _AudioInputRecorder_giveWarning.set(this, (message) => {
            this.warning.textContent = message;
        });
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
        this.startButton.addEventListener("click", __classPrivateFieldGet(this, _AudioInputRecorder_handleStartRecording, "f"));
        this.stopButton.addEventListener("click", __classPrivateFieldGet(this, _AudioInputRecorder_handleStopRecording, "f"));
        this.playButton.addEventListener("click", __classPrivateFieldGet(this, _AudioInputRecorder_handlePlayRecording, "f"));
        this.audio.addEventListener("ended", () => __classPrivateFieldGet(this, _AudioInputRecorder_changeIndicatorColor, "f").call(this, "inactive"));
        this.cancelButton.addEventListener("click", __classPrivateFieldGet(this, _AudioInputRecorder_handleCloseDialog, "f"));
        this.finishButton.addEventListener("click", __classPrivateFieldGet(this, _AudioInputRecorder_handleUpdateAudioFiles, "f"));
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
            this.mediaRecorder.ondataavailable = __classPrivateFieldGet(this, _AudioInputRecorder_handleSetAudioUrl, "f");
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
}
_AudioInputRecorder_handleStartRecording = new WeakMap(), _AudioInputRecorder_handleStopRecording = new WeakMap(), _AudioInputRecorder_handlePlayRecording = new WeakMap(), _AudioInputRecorder_handleUpdateAudioFiles = new WeakMap(), _AudioInputRecorder_handleCloseDialog = new WeakMap(), _AudioInputRecorder_handleSetAudioUrl = new WeakMap(), _AudioInputRecorder_changeIndicatorColor = new WeakMap(), _AudioInputRecorder_hasName = new WeakMap(), _AudioInputRecorder_hasNewName = new WeakMap(), _AudioInputRecorder_hasAudioFile = new WeakMap(), _AudioInputRecorder_giveWarning = new WeakMap();
export default AudioInputRecorder;
customElements.define("audio-input-recorder", AudioInputRecorder);
//# sourceMappingURL=AudioInputRecorder.js.map