var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
let SoundSelector = class SoundSelector extends LitElement {
    constructor() {
        super(...arguments);
        this.recordings = [];
        this.slideRecordings = [];
    }
    static { this.styles = [
        css `
            :host {
                --fontSize: 1.1rem;
                --inputPadding: 5px;

                    select {
                        font-size: var(--fontSize);
                        padding: var(--inputPadding);
                    }

                 @media screen and (max-width:600px) {
                    --fontSize: 1rem;
                    --inputPadding: 5px;
                    --inputWidth: 100%;

                /* select{} */
                }
            }
        `
    ]; }
    optionTemplate(recording) {
        const isSelected = this.slideRecordings.includes(recording.id);
        return html `<option ?selected=${isSelected} value=${recording.id}>${recording.name}</option>`;
    }
    render() {
        const noSelectedRecording = this.slideRecordings.length === 0;
        return html `
        <select class="sound_select" name="soundurl" @input=${this.onSlideRecordingChanged} >
            <option value="" ?selected=${noSelectedRecording} > --- No Sound File Chosen </option>
            ${map(this.recordings, (recording) => this.optionTemplate(recording))}
        </select>
    `;
    }
    onSlideRecordingChanged(e) {
        if (this.slideOrder === undefined)
            return;
        let { value } = e.target;
        const field = "recordings";
        const options = {
            detail: { action: "slideChanged", field, value: value ? [value] : [], slideOrder: this.slideOrder },
            bubbles: true,
            composed: true
        };
        this.dispatchEvent(new CustomEvent('stateChanged', options));
    }
};
__decorate([
    property({ type: Array })
], SoundSelector.prototype, "recordings", void 0);
__decorate([
    property({ type: Array })
], SoundSelector.prototype, "slideRecordings", void 0);
__decorate([
    property({ type: Number })
], SoundSelector.prototype, "slideOrder", void 0);
__decorate([
    query("select")
], SoundSelector.prototype, "_select", void 0);
SoundSelector = __decorate([
    customElement("sound-selector")
], SoundSelector);
export { SoundSelector };
//# sourceMappingURL=SoundSelector.js.map