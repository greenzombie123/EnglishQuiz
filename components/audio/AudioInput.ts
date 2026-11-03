import "./AudioInputTab.ts";
import "./AudioInputRecorder.ts";

import { LitElement, html, css, PropertyValues, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js"
import type { AudioInputRecorder } from "./AudioInputRecorder.ts";
import { removeExtention } from "../../util/util.ts";
import { AudioFilesUpdated } from "../lessonCreater/types.ts";
import { Recording } from "../types.ts";
import { v7 as createId } from "uuid";

@customElement("audio-input")
export class AudioInput extends LitElement {
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

  @property({type:Array})
  recordings: Recording[] = []

  @query("audio-input-recorder")
  audioInputRecorder?: AudioInputRecorder

  @query("input")
  _fileInput?: HTMLInputElement

  render() {

    return html`
      <p>Add an audio file or record a new one.</p>
        <div class="buttons">
            <button id="audio_recorder_button" type="button" @click=${this.recorderClickedHandler}></button>
            <label id="audio_file_input_button" for="audio_file_input">
                <input type="file" name="audio" id="audio_file_input" accept="audio/*" @change=${this.fileInputChanged}>
            </label>
        </div>

        ${!this.recordings.length ? html`<p class="soundFileNames">No Files Added</p>` : html`<p class="soundFileNames">${this.recordings.length} files added</p>`}

        <ul>
          ${this.recordings.map(recording => html`<audio-input-tab .recording=${recording}></audio-input-tab>`)}
        </ul>

        <audio-input-recorder .audioFileNames=${this.createAudioFileNames()}></audio-input-recorder>
    `;
  }

  // TODO Check if file name is similar to another file. Advise user to use a different file name. 
  private fileInputChanged(event: InputEvent) {

    const target = event.target as HTMLInputElement

    if (target.files && target.files[0]) {

      const file = target.files[0]

      const option: CustomEventInit<AudioFilesUpdated> = {
        bubbles: true,
        composed: true,
        detail: { recording: { id: createId(), key: createId(), name: removeExtention(file.name), file, url:"", isNew:true }, action: "audioFilesUpdated" }
      }
    
      this.dispatchEvent(new CustomEvent("stateChanged", option))
    }
  }

  private createAudioFileNames() {
    return this.recordings.map(recording => removeExtention(recording.name))
  }

  private recorderClickedHandler() {
    if (this.audioInputRecorder) {
      this.audioInputRecorder.open()
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "audio-input": AudioInput;
  }
}
