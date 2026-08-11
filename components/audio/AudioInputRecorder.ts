import { lesssonCreaterStore } from "../store/LessonCreaterStore.ts";

import { LitElement, html, css } from "lit";
import { customElement, property, query, state } from "lit/decorators.js"
import { SoundFile } from "../types.ts";
import { AudioFilesUpdated } from "../lessonCreater/types.ts";

export default class AudioInputRecorder extends HTMLElement {
  private store;
  private root;
  private mediaRecorder: MediaRecorder | undefined;
  private dialog;
  private startButton;
  private stopButton;
  private playButton;
  private name;
  private finishButton;
  private cancelButton;
  private indicator;
  private audio;
  private warning;
  private mimeType = "";
  private audioFile: { url: string; file: Blob } | null = null;

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "closed" });
    const template = document.getElementById(
      "audio-input-recorder",
    ) as HTMLTemplateElement;

    this.root.appendChild(template.content.cloneNode(true));

    this.dialog = this.root.querySelector("dialog") as HTMLDialogElement;
    this.startButton = this.root.querySelector(".start") as HTMLButtonElement;
    this.stopButton = this.root.querySelector(".stop") as HTMLButtonElement;
    this.playButton = this.root.querySelector(".play") as HTMLButtonElement;
    this.name = this.root.querySelector("#name") as HTMLInputElement;
    this.finishButton = this.root.querySelector(".finish") as HTMLButtonElement;
    this.cancelButton = this.root.querySelector(".cancel") as HTMLButtonElement;
    this.indicator = this.root.querySelector(".circle") as HTMLDivElement;
    this.audio = this.root.querySelector("audio") as HTMLAudioElement;
    this.warning = this.root.querySelector(".warning") as HTMLSpanElement;

    // Add listeners to buttons and inputs

    this.startButton.addEventListener("click", this.#handleStartRecording);
    this.stopButton.addEventListener("click", this.#handleStopRecording);
    this.playButton.addEventListener("click", this.#handlePlayRecording);
    this.audio.addEventListener("ended", () =>
      this.#changeIndicatorColor("inactive"),
    );
    this.cancelButton.addEventListener("click", this.#handleCloseDialog);
    this.finishButton.addEventListener("click", this.#handleUpdateAudioFiles);

    this.store = lesssonCreaterStore;

    this.store.subscribe("audioFilesChanged", this.handleAudioFileCreated);
  }

  connectedCallback() { }

  handleAudioFileCreated = () => { };

  async getMedia() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = 'audio/webm;codecs=opus'
      this.mediaRecorder = new MediaRecorder(stream, { mimeType });

      // When the media recorder stops, get the blob from the captured media
      this.mediaRecorder.ondataavailable = this.#handleSetAudioUrl;

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async open() {
    this.dialog.showModal();
    const canUseMedia = await this.getMedia();
    if (!canUseMedia) this.dialog.close();
  }

  #handleStartRecording = () => {
    if (
      this.mediaRecorder &&
      this.mediaRecorder.state === "inactive" &&
      this.audio.paused
    ) {
      if (this.audioFile) {
        URL.revokeObjectURL(this.audioFile.url);
        this.audioFile = null;
      }

      this.#changeIndicatorColor("recording");

      this.mediaRecorder.start();
    }
  };

  #handleStopRecording = () => {
    if (
      this.mediaRecorder &&
      this.mediaRecorder.state === "recording" &&
      this.audio.paused
    ) {
      this.#changeIndicatorColor("inactive");

      this.mediaRecorder.stop();
    }
  };

  #handlePlayRecording = () => {
    if (
      this.mediaRecorder &&
      this.mediaRecorder.state === "inactive" &&
      this.audioFile
    ) {
      this.audio.src = this.audioFile.url;
      this.audio.play();
      this.#changeIndicatorColor("playing");
    }
  };

  #handleUpdateAudioFiles = () => {
    if (!this.audioFile?.file)
      return this.#giveWarning("No file has been recorded yet.");
    if (!this.#hasName())
      return this.#giveWarning("Write the name of the audio file");
    if (!this.#hasNewName())
      return this.#giveWarning("Another audio file has the same name.");

    // Grab the audio files and add the newly recorded one to the array and set as new state

    const audioFiles = this.store.getState("audioFiles")
    const newAudioFile = new File([this.audioFile.file], this.name.value + '.webm', { type: this.audioFile.file.type })

    this.store.setState("audioFiles", [...audioFiles, newAudioFile])

    this.#handleCloseDialog();
  };

  #handleCloseDialog = () => {
    URL.revokeObjectURL(this.audioFile?.url || "");
    this.audioFile = null;
    this.audio.src = "";
    this.name.value = "";
    this.dialog.close();
  };

  #handleSetAudioUrl = (event: BlobEvent) => {
    this.audioFile = { url: URL.createObjectURL(event.data), file: event.data };
  };

  #changeIndicatorColor = (
    state: Exclude<RecordingState, "paused"> | "playing",
  ) => {
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

  #hasName = () => this.name.value !== "";

  #hasNewName = () => {
    const audioFilesNames = this.store
      .getState("audioFiles")
      .map((audioFile) => audioFile.name)

    if (!audioFilesNames.length) return true

    return audioFilesNames.some(
      (audioFilesName) => audioFilesName !== this.name.value,
    );
  };

  #hasAudioFile = () => this.audioFile !== null;

  #giveWarning = (message: string) => {
    this.warning.textContent = message;
  };
}

customElements.define("audio-input-recorder", AudioInputRecorder);

@customElement("audio-input-recorderr")
export class AudioInputRecorderr extends LitElement {
  static styles = [
    css`
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
  ];

  @property({ type: Array })
  audioFileNames: string[] = []

  @state()
  blob?: Blob | undefined

  @query("dialog")
  _dialog?: HTMLDialogElement

  @query(".circle")
  _indicator?: HTMLSpanElement

  @query("audio")
  _audio?: HTMLAudioElement

  @state()
  name = ""

  @query(".message")
  _message?: HTMLSpanElement

  @query("input")
  _input?: HTMLInputElement

  // To cancel out setInterval when changing messages
  timeOut: NodeJS.Timeout | undefined

  mediaRecorder?: MediaRecorder

  render() {

    return html`
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

  private isNameNew() {
    const isNameUsed = this.audioFileNames.some(audioFileName => audioFileName === this.name)
    return isNameUsed ? false : true
  }

  private resetRecorderState() {
    this.blob = undefined;
    this.name = ""
    if (this._audio) URL.revokeObjectURL(this._audio.src)
    if (this._input) this._input.value = ""
  }

  private handleCloseRecorder() {

    this.resetRecorderState()

    this._dialog?.close()
  }

  private handleUpdateAudioFiles() {
    if (!this.blob) return this.showMessage("No recording present. Please make a recording.")
    if (!this.isNameNew()) return this.showMessage("This name is already being used by another audio file.")
    if (!this.name) return this.showMessage("Please enter file's name.")

    const option: CustomEventInit<AudioFilesUpdated> = {
      bubbles: true,
      composed: true,
      detail: { audioFile: new File([this.blob], this.name + '.webm', { type: this.blob.type }), action: "audioFilesUpdated" }
    }

    this.dispatchEvent(new CustomEvent("stateChanged", option))

    this.handleCloseRecorder()
  }

  private showMessage(message: string) {
    if (this._message) {

      clearTimeout(this.timeOut)

      this._message.textContent = message

      const clearMessage = () => (this._message as HTMLSpanElement).textContent = ""

      this.timeOut = setTimeout(() => {
        clearMessage()
      }, 3000)
    }
  }

  private async getMedia() {
    try {

      if (!this._audio) throw new Error("Can't play recording.")

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = 'audio/webm;codecs=opus'
      this.mediaRecorder = new MediaRecorder(stream, { mimeType });

      // When the media recorder stops, get the blob from the captured media
      this.mediaRecorder.ondataavailable = this.handleSetAudioFile;

      this._audio!.onended = () => this.handleAudioEnded()

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private handleSetAudioFile = (event: BlobEvent) => {
    if (!this._audio) throw new Error("Something is wrong with the audio")
    this.blob = event.data
    this._audio.src = URL.createObjectURL(this.blob)
  }


  private handleAudioEnded() {
    this.changeIndicatorColor("inactive")
  }

  public async open() {
    if (this._dialog) {
      this._dialog.showModal();
      const canUseMedia = await this.getMedia();
      if (!canUseMedia) this._dialog.close();
    }
  }

  private handleStartRecording() {
    if (
      this.mediaRecorder &&
      this.mediaRecorder.state === "inactive" &&
      this._audio &&
      this._audio.paused
    ) {

      if (this.blob) URL.revokeObjectURL(this._audio.src);
      this.blob = undefined;

      this.changeIndicatorColor("recording");

      this.mediaRecorder.start();
    }
  }

  private handleStopRecording() {
    if (
      this.mediaRecorder &&
      this.mediaRecorder.state === "recording" &&
      this._audio
    ) {
      this.changeIndicatorColor("inactive");

      this.mediaRecorder.stop();
    }
  }

  private handlePlayRecording() {
    if (
      this.mediaRecorder &&
      this.mediaRecorder.state === "inactive" &&
      this._audio &&
      this.blob
    ) {
      this._audio.play();
      this.changeIndicatorColor("playing");
    }
  }

  private handleNameChanged(e: Event) {
    const input = e.target as HTMLInputElement
    const name = input.value

    this.name = name
  }

  private changeIndicatorColor = (
    state: Exclude<RecordingState, "paused"> | "playing",
  ) => {

    if (!this._indicator) return

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

declare global {
  interface HTMLElementTagNameMap {
    "audio-input-recorderr": AudioInputRecorderr;
  }
}
