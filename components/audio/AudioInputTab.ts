import { removeExtention } from "../../util/util.ts";
import { AudioFileDeleted } from "../lessonCreater/types.ts";
import { lesssonCreaterStore } from "../store/LessonCreaterStore.ts";
import type { PopUpModal } from "../utility/PopUpModal.ts";
import "../utility/PopUpModal.ts";

import { LitElement, html, css, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js"

@customElement("audio-input-tab")
export class AudioInputTab extends LitElement {
  static styles = [
    css`
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
  ];

  @property({ type: Object })
  audioFile?: File

  @query("audio")
  _audio?: HTMLAudioElement

  blobUrl?: string

  fileName?: string

  private tabTemplate() {

    if (!this.audioFile) throw new Error("Expected an audio file but was not found")
    this.blobUrl = URL.createObjectURL(this.audioFile)
    this.fileName = removeExtention(this.audioFile.name)

    return html`
       <div class="audio_input_tab">
            <span>${this.fileName}</span>
            <!-- Add images later -->
            <button type="button" class="play" @click=${this.handlePlayAudio}>P</button>
            <button type="button" class="delete" @click=${this.handleDeleteAudio}>D</button>
            <audio src=${this.blobUrl}></audio>
       </div>
    `
  }

  render() {
    return this.tabTemplate();
  }

  disconnectedCallback(): void {
    if (this.blobUrl) URL.revokeObjectURL(this.blobUrl)
  }

  handlePlayAudio() {
    if (!this._audio) throw new Error("Audio was not found")

    this._audio.play()
  }

  handleDeleteAudio() {
    const init: CustomEventInit<AudioFileDeleted> = {
      bubbles: true,
      composed: true,
      detail: { action: "audioFileDeleted", name: this.fileName! }
    }

    this.dispatchEvent(new CustomEvent("stateChanged", init))
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "audio-input-tab": AudioInputTab;
  }
}
