import { LitElement, html, css } from "lit";
import { customElement, property, query, state } from "lit/decorators.js"
import { map } from "lit/directives/map.js";
import { SlideAdded, SlideChanged } from "./types.ts";

@customElement("sound-selector")
export class SoundSelector extends LitElement {
    static styles = [
        css`
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
    ];

    @property()
    selectedSoundurl = ""

    @property({ type: Array })
    soundUrls: string[] = []

    @property({ type: Number })
    slideOrder?: number

    @query("select")
    _select?: HTMLSelectElement

    optionTemplate(soundUrl: string) {
        const isSelected = soundUrl === this.selectedSoundurl
        return html`<option ?selected=${isSelected} value=${soundUrl}>${soundUrl}</option>`
    }


    render() {

        return html`
        <select class="sound_select" name="soundurl" @input=${this.onSoundUrlChanged} >
            <option value=${this.selectedSoundurl} ?selected=${!this.selectedSoundurl} > --- No Sound File Chosen </option>
            ${map(this.soundUrls, (soundUrl) => this.optionTemplate(soundUrl))}
        </select>
    `;
    }

    onSoundUrlChanged(e: Event) {
        if (this.slideOrder === undefined) return;

        const { value } = e.target as HTMLSelectElement

        const field = "soundurl"

        const options: CustomEventInit<SlideChanged> = {
            detail: { action: "slideChanged", field, value, slideOrder: this.slideOrder },
            bubbles: true,
            composed: true
        }

        this.dispatchEvent(new CustomEvent('stateChanged', options))

    }
}

declare global {
    interface HTMLElementTagNameMap {
        "sound-selector": SoundSelector;
    }
}
