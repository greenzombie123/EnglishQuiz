import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js"
import { choose } from "lit/directives/choose.js";
import {SlideChanged, SlideDeleted, SlideOrderChanged } from "./types.ts";
import { ifDefined } from "lit/directives/if-defined.js";
import { MoveButtonState } from "./LessonCreator.ts";
import { live } from "lit/directives/live.js";
import { IntroSlideData, QuestionSlideData, SlideData } from "../types.ts";

@customElement("slide-fieldset")
export class SlideFieldSet extends LitElement {
    static styles = [
        css`
            :host {
                .slide-fieldSet {
                    display: flex;
                    gap: 15px;
                    background-color: #f1f1f1;
                    width: fit-content;
                    margin: 15px 0;

                    fieldset {
                        width: 500px;
                        margin: 25px 0;
                        border: none;
                        border-radius: 5px;

                        legend {
                            font-size: 1.2rem;
                            position: relative;
                            top: -15px;
                            font-weight: bold;
                        }

                        label,
                        input,
                        select {
                            font-size: var(--fontSize);
                        }

                        label {
                            display: flex;
                            flex-direction: column;
                            margin-bottom: 20px;
                            gap: 5px;
                        }

                        input,
                        select {
                            padding: var(--inputPadding);
                        }
                    }

                    .fieldSetButtons {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;

                        .deleteFieldSet {
                            margin-bottom: auto;
                        }

                        button {
                            height: 30px;
                            width: 30px;
                            padding: 0;
                            cursor: pointer;

                            svg {
                                width: 15px;
                                height: 15px;
                            }
                        }
                    }
                }  
            }   

             @media screen and (max-width:600px) {
                    :host {
                        --fontSize: 1rem;
                        --inputPadding: 5px;
                        --inputWidth: 100%;

                        .slide-fieldSet {
                            width: var(--inputWidth);
                        }
                    }
            
        `
    ];

    @property({ type: Object })
    public slide?: SlideData

    @property({ type: Array })
    public soundUrls: string[] = []

    @property()
    public moveButtonState: MoveButtonState = "none"

    introSlideTemplate() {
        const { targetword, definition } = this.slide as IntroSlideData

        return html`
            <legend>Introduction</legend>
            <label>Enter the target word
                <input type="text" name="targetword" .value=${targetword} @input=${this.onSlideChanged} required/>
            </label>
            <label>Enter definition of target word
                <input type="text" name="definition" .value=${definition} @input=${this.onSlideChanged} required/>
            </label>
        `
    }

    questionSlideTemplate() {
        const { question, correctanswer, wronganswer1, wronganswer2, wronganswer3 } = this.slide as QuestionSlideData

        return html`
            <legend>Question</legend>
            <label>Enter question
                <input type="text" required .value=${question} name="question" @input=${this.onSlideChanged} />
            </label>
            <label>Enter the correct answer
                <input type="text" required .value=${correctanswer} name="correctanswer" @input=${this.onSlideChanged} />
            </label>
            <label>Enter the wrong answer
                <input type="text" required .value=${wronganswer1} name="wronganswer1" @input=${this.onSlideChanged} />
            </label>
            <label>Enter the wrong answer (Optional)
                <input type="text" .value=${wronganswer2} name="wronganswer2" @input=${this.onSlideChanged} />
            </label>
            <label>Enter the wrong answer (Optional)
                <input type="text" .value=${wronganswer3} name="wronganswer3" @input=${this.onSlideChanged} />
            </label>
        `
    }

    moveButtonTemplate(type: "up" | "down", index: -1 | 1) {

        const path = type === "up" ? "M7.5 3L15 11H0L7.5 3Z" : "M7.49988 12L-0.00012207 4L14.9999 4L7.49988 12Z"

        return html`
            <button value=${index} @click=${this.onSlideOrderChanged}>
                <svg width="30px" height="30px" viewBox="0 0 15 15" fill="none">
                    <path d=${path} fill="#000000"></path>
                </svg>
            </button>
        `
    }

    addMoveButtons(state: MoveButtonState) {
        if (state === "down") return this.moveButtonTemplate("down", 1);
        if (state === "up") return this.moveButtonTemplate("up", -1);
        if (state === "both") return html`
            ${this.moveButtonTemplate("up", -1)}
            ${this.moveButtonTemplate("down", 1)}
        `
        else return nothing
    }

    render() {

        return html`
            <div class="slide-fieldSet">
                <fieldset>
                    ${choose(this.slide?.type, [
            ["intro", () => this.introSlideTemplate()],
            ["question", () => this.questionSlideTemplate()]
        ])}
                    <input type="hidden" name="slideorder" id="slideOrderInput" value=${ifDefined(this.slide?.slideorder)} />
                    
                    <sound-selector slideOrder=${ifDefined(this.slide?.slideorder)} selectedSoundurl=${ifDefined(this.slide?.soundurl)} .soundUrls=${this.soundUrls} ></sound-selector>
                
                </fieldset>
                <div class="fieldSetButtons">

                    <button class="deleteFieldSet" type="button" @click=${this.onSlideDeleted}>X</button>
                
                     ${this.addMoveButtons(this.moveButtonState)}

                </div>
            </div>
        `;
    }

    //TODO Maybe change this later!!!!!
    onSlideChanged(e: Event) {
        const field = (e.target as HTMLInputElement).name as keyof IntroSlideData | keyof QuestionSlideData
        const { value } = (e.target as HTMLInputElement)
        const slideOrder = this.slide?.slideorder as number

        const options: CustomEventInit<SlideChanged> = {
            detail: { action: "slideChanged", field, value, slideOrder },
            bubbles: true,
            composed: true
        }

        this.dispatchEvent(new CustomEvent('stateChanged', options))
    }

    onSlideOrderChanged(e: Event) {
        if (!this.slide) return

        const index = +((e.currentTarget as HTMLButtonElement).value)
        const { slideorder } = this.slide

        const options: CustomEventInit<SlideOrderChanged> = {
            detail: { action: "slideOrderChanged", oldSlideOrder: slideorder, newSlideOrder: slideorder + index },
            bubbles: true,
            composed: true
        }

        this.dispatchEvent(new CustomEvent('stateChanged', options))
    }

    onSlideDeleted(e: Event) {
        if (!this.slide) return

        const { slideorder } = this.slide

        const options: CustomEventInit<SlideDeleted> = {
            detail: { action: "slideDeleted", slideorder },
            bubbles: true,
            composed: true
        }

        this.dispatchEvent(new CustomEvent('stateChanged', options))
    }

}

declare global {
    interface HTMLElementTagNameMap {
        "slide-fieldset": SlideFieldSet;
    }
}
