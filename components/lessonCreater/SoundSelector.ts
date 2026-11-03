import { LitElement, html, css } from "lit";
import { customElement, property, query, state } from "lit/decorators.js"
import { map } from "lit/directives/map.js";
import { SlideAdded, SlideChanged } from "./types.ts";
import { removeExtention } from "../../util/util.ts";
import { Recording } from "../types.ts";

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

    @property({ type: Array })
    recordings: Recording[] = []

    @property({ type: Array })
    slideRecordings: string[] = []

    @property({ type: Number })
    slideOrder?: number

    @query("select")
    _select?: HTMLSelectElement

    optionTemplate(recording: Recording) {
        const isSelected = this.slideRecordings.includes(recording.id)
        return html`<option ?selected=${isSelected} value=${recording.id}>${recording.name}</option>`
    }


    render() {

        const noSelectedRecording = this.slideRecordings.length === 0

        return html`
        <select class="sound_select" name="soundurl" @input=${this.onSlideRecordingChanged} >
            <option value="" ?selected=${noSelectedRecording} > --- No Sound File Chosen </option>
            ${map(this.recordings, (recording) => this.optionTemplate(recording))}
        </select>
    `;
    }

    onSlideRecordingChanged(e: Event) {
        if (this.slideOrder === undefined) return;

        let { value } = e.target as HTMLSelectElement

        const field = "recordings"

        const options: CustomEventInit<SlideChanged> = {
            detail: { action: "slideChanged", field, value: value ? [value] : [], slideOrder: this.slideOrder },
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
