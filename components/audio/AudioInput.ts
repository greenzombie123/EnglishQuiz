import { lesssonCreaterStore } from "../store/LessonCreaterStore.ts";
import "./AudioInputTab.ts";
import type AudioInputTab from "./AudioInputTab.ts";
import type AudioInputRecorder from "./AudioInputRecorder.ts";
import "./AudioInputRecorder.ts";

import { LitElement, html, css } from "lit";
import { customElement, property, query, state } from "lit/decorators.js"
import type { AudioInputRecorderr } from "./AudioInputRecorder.ts";
import { removeExtention } from "../../util/util.ts";

export default class AudioInput extends HTMLElement {
  private root;
  private inputFileButton: HTMLInputElement;
  private recorderButton: HTMLButtonElement
  private store;

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "closed" });
    const template = document.getElementById(
      "audio-input",
    ) as HTMLTemplateElement;

    this.root.appendChild(template.content.cloneNode(true));

    this.inputFileButton = this.root.querySelector(
      "#audio_file_input",
    ) as HTMLInputElement;

    this.recorderButton = this.root.querySelector(
      "#audio_recorder_button",
    ) as HTMLButtonElement;

    this.addEventListener("change", this.handleChangeInputFile);

    this.inputFileButton.addEventListener("change", this.handleChangeInputFile);
    this.recorderButton.addEventListener("click", this.handleAudioRecorderButtonClicked)

    this.store = lesssonCreaterStore;

    // Subscribe to store events
    this.store.subscribe("audioFilesChanged", this.handleAudioFilesChanged);
  }

  connectedCallback() { }

  disconnectedCallback() { }

  attributeChangedCallback() { }

  handleChangeInputFile = (event: Event) => {
    const files = (event.target as HTMLInputElement).files;

    if (files && files[0]) {
      const audioFiles = this.store.getState("audioFiles");

      const newAudioFiles = [...audioFiles, files[0]];

      this.store.setState("audioFiles", newAudioFiles);
    }
  };

  handleAudioFilesChanged = () => {
    const audioFiles = this.store.getState("audioFiles");

    const ul = this.root.querySelector("ul") as HTMLUListElement;

    ul.replaceChildren();

    const soundFileNames = this.root.querySelector(
      ".soundFileNames",
    ) as HTMLParagraphElement;

    soundFileNames.textContent = `There is ${audioFiles.length} files`;

    audioFiles.forEach((audioFile) => {

      const audioInputTab = document.createElement(
        "audio-input-tab",
      ) as AudioInputTab;

      audioInputTab.setAudioUrl(audioFile)

      ul.appendChild(audioInputTab);
    });
  };

  handleAudioRecorderButtonClicked = () => {
    const audioInputRecorder = this.root.querySelector("audio-input-recorder") as AudioInputRecorder

    audioInputRecorder.open()
  }

}

customElements.define("audio-input", AudioInput);


@customElement("audio-inputt")
export class AudioInputt extends LitElement {
  static styles = [
    css`
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
  ];

  @property({ type: Array })
  audioFiles: File[] = []

  @query("audio-input-recorderr")
  audioInputRecorder?: AudioInputRecorderr

  render() {
    return html`
      <p>Add an audio file or record a new one.</p>
        <div class="buttons">
            <button id="audio_recorder_button" type="button" @click=${this.recorderClickedHandler}></button>
            <label id="audio_file_input_button" for="audio_file_input">
                <input type="file" name="audio" id="audio_file_input" accept="audio/*">
            </label>
        </div>

        <p class="soundFileNames">No Files Added</p>

        <ul>
          ${this.audioFiles.map(audioFile => html`<audio-input-tabb .audioFile=${audioFile}></audio-input-tabb>`)}
        </ul>

        <audio-input-recorderr .audioFileNames=${this.createAudioFileNames()}></audio-input-recorderr>
    `;
  }

  private createAudioFileNames() {
    return this.audioFiles.map(audioFile => removeExtention(audioFile.name))
  }

  private recorderClickedHandler() {
    if (this.audioInputRecorder) {
      this.audioInputRecorder.open()
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "audio-inputt": AudioInputt;
  }
}
