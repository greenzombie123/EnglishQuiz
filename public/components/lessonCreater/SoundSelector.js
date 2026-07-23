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
        this.selectedSoundurl = "";
        this.soundUrls = [];
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
    optionTemplate(soundUrl) {
        const isSelected = soundUrl === this.selectedSoundurl;
        return html `<option ?selected=${isSelected} value=${soundUrl}>${soundUrl}</option>`;
    }
    render() {
        return html `
        <select class="sound_select" name="soundurl" @input=${this.onSoundUrlChanged} >
            <option value=${this.selectedSoundurl} ?selected=${!this.selectedSoundurl} > --- No Sound File Chosen </option>
            ${map(this.soundUrls, (soundUrl) => this.optionTemplate(soundUrl))}
        </select>
    `;
    }
    onSoundUrlChanged(e) {
        if (this.slideOrder === undefined)
            return;
        const { value } = e.target;
        const field = "soundurl";
        const options = {
            detail: { action: "slideChanged", field, value, slideOrder: this.slideOrder },
            bubbles: true,
            composed: true
        };
        this.dispatchEvent(new CustomEvent('stateChanged', options));
    }
};
__decorate([
    property()
], SoundSelector.prototype, "selectedSoundurl", void 0);
__decorate([
    property({ type: Array })
], SoundSelector.prototype, "soundUrls", void 0);
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