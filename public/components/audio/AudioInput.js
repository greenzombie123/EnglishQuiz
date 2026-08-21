var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import "./AudioInputTab.js";
import "./AudioInputRecorder.js";
import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { removeExtention } from "../../util/util.js";
let AudioInput = class AudioInput extends LitElement {
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
                <input type="file" name="audio" id="audio_file_input" accept="audio/*" @change=${this.fileInputChanged}>
            </label>
        </div>

        <p class="soundFileNames">No Files Added</p>

        <ul>
          ${this.audioFiles.map(audioFile => html `<audio-input-tab .audioFile=${audioFile}></audio-input-tab>`)}
        </ul>

        <audio-input-recorder .audioFileNames=${this.createAudioFileNames()}></audio-input-recorder>
    `;
    }
    // TODO Check if file name is similar to another file. Advise user to use a different file name. 
    fileInputChanged(event) {
        const target = event.target;
        if (target.files && target.files[0]) {
            const option = {
                bubbles: true,
                composed: true,
                detail: { audioFile: target.files[0], action: "audioFilesUpdated" }
            };
            this.dispatchEvent(new CustomEvent("stateChanged", option));
        }
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
], AudioInput.prototype, "audioFiles", void 0);
__decorate([
    query("audio-input-recorder")
], AudioInput.prototype, "audioInputRecorder", void 0);
__decorate([
    query("input")
], AudioInput.prototype, "_fileInput", void 0);
AudioInput = __decorate([
    customElement("audio-input")
], AudioInput);
export { AudioInput };
//# sourceMappingURL=AudioInput.js.map