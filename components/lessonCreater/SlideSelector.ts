import { LitElement, html, css } from "lit";
import { customElement, property, query, state } from "lit/decorators.js"
import { SlideAdded } from "./types.ts";

@customElement("slide-selector")
export class SlideSelector extends LitElement {
    static styles = [
        css`
            :host {
                --itemWidth: 33vw;
                --fontSize: 1.1rem;
                --inputPadding: 5px;
            }

            .slideSelecter {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    width: fit-content;
                    border: 1px black solid;
                    margin: 25px 0;
                    padding: 10px;

                    label {
                        font-size: var(--fontSize)
                    }

                    select {
                        font-size: var(--fontSize)
                    }

                    button {}
            }

            
        `
    ];

    @query("select")
    private _select?: HTMLSelectElement

    render() {

        return html`
            <div class="slideSelecter">
                <label for="select">Choose what type of slide to make.</label>
                <select name="" id="slideSelecter">
                    <option value="" selected>--Choose a slide</option>
                    <option value="intro">Introduce grammar or vocabulary</option>
                    <option value="question">Make a question</option>
                </select>
                <button type="button" @click=${this.onSlideSelectorButtonClicked} id="slide-selecterButton">Add New Slide</button>
            </div>
        `;
    }

    //TODO Maybe get rid of "as"
    onSlideSelectorButtonClicked() {
        const value = this._select?.value as "intro" | "question"

        if (value) {
            const options: CustomEventInit<SlideAdded> = {
                detail: { action:"slideAdded", value},
                bubbles: true,
                composed: true
            }

            this.dispatchEvent(new CustomEvent('stateChanged', options))
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "slide-selector": SlideSelector;
    }
}
