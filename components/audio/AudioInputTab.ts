import { removeExtention } from "../../util/util.ts";
import { AudioFileDeleted } from "../lessonCreater/types.ts";
import { lesssonCreaterStore } from "../store/LessonCreaterStore.ts";
import type { PopUpModal } from "../utility/PopUpModal.ts";
import "../utility/PopUpModal.ts";

import { LitElement, html, css, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js"

export default class AudioInputTab extends HTMLElement {
  private root;
  private audioFile: File | null = null;
  private audio;
  private store;

  static observedAttributes = ["fileName"];

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "closed" });
    const template = document.getElementById(
      "audio-input-tab",
    ) as HTMLTemplateElement;

    this.root.appendChild(template.content.cloneNode(true));

    this.audio = this.root.querySelector("audio") as HTMLAudioElement;

    this.store = lesssonCreaterStore;
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) { }

  connectedCallback() {
    if (!this.audioFile) return Error("No audio file was set");

    const url = URL.createObjectURL(this.audioFile);
    this.audio.src = url;

    const span = this.root.querySelector("span") as HTMLSpanElement;
    span.textContent = this.audioFile.name

    const playButton = this.root.querySelector(".play") as HTMLButtonElement;
    const deleteButton = this.root.querySelector(
      ".delete",
    ) as HTMLButtonElement;

    playButton.addEventListener("click", () => {
      this.audio.play();
    });

    deleteButton.addEventListener("click", this.handleDeleteButtonClicked);
  }

  setAudioUrl(file: File) {
    this.audioFile = file;
  }

  handleDeleteButtonClicked = () => {
    const popUpModal = document.createElement("pop-up-modal") as PopUpModal;

    const topMessage = `Delete this audio file?`
    const bottomMessage = `${this.audioFile ? this.audioFile.name : ""}`

    this.root.appendChild(popUpModal)

    popUpModal.showPopUpModal(topMessage, bottomMessage, this.handleRemoveAudioFile)
  }

  handleRemoveAudioFile = () => {
    if (!this.audioFile) return Error("No audio file was set");

    const audioFiles = this.store.getState("audioFiles");
    const deletingAudioFile = this.audioFile;

    const newAudioFiles = audioFiles.filter(
      (audioFile) => audioFile.name !== deletingAudioFile.name,
    );
    this.store.setState("audioFiles", newAudioFiles);
  };
}

customElements.define("audio-input-tab", AudioInputTab);


@customElement("audio-input-tabb")
export class AudioInputTabb extends LitElement {
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
    "audio-input-tabb": AudioInputTabb;
  }
}
