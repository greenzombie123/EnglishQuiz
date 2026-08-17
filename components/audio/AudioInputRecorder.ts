import { LitElement, html, css } from "lit";
import { customElement, property, query, state } from "lit/decorators.js"
import { AudioFilesUpdated } from "../lessonCreater/types.ts";

@customElement("audio-input-recorder")
export class AudioInputRecorder extends LitElement {
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
    "audio-input-recorder": AudioInputRecorder;
  }
}
