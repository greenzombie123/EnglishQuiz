var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { choose } from "lit/directives/choose.js";
import { ifDefined } from "lit/directives/if-defined.js";
let SlideFieldSet = class SlideFieldSet extends LitElement {
    constructor() {
        super(...arguments);
        this.soundUrls = [];
        this.moveButtonState = "none";
    }
    static { this.styles = [
        css `
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
    ]; }
    introSlideTemplate() {
        const { targetword, definition } = this.slide;
        return html `
            <legend>Introduction</legend>
            <label>Enter the target word
                <input type="text" name="targetword" .value=${targetword} @input=${this.onSlideChanged} required/>
            </label>
            <label>Enter definition of target word
                <input type="text" name="definition" .value=${definition} @input=${this.onSlideChanged} required/>
            </label>
        `;
    }
    questionSlideTemplate() {
        const { question, correctanswer, wronganswer1, wronganswer2, wronganswer3 } = this.slide;
        return html `
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
        `;
    }
    moveButtonTemplate(type, index) {
        const path = type === "up" ? "M7.5 3L15 11H0L7.5 3Z" : "M7.49988 12L-0.00012207 4L14.9999 4L7.49988 12Z";
        return html `
            <button value=${index} @click=${this.onSlideOrderChanged}>
                <svg width="30px" height="30px" viewBox="0 0 15 15" fill="none">
                    <path d=${path} fill="#000000"></path>
                </svg>
            </button>
        `;
    }
    addMoveButtons(state) {
        if (state === "down")
            return this.moveButtonTemplate("down", 1);
        if (state === "up")
            return this.moveButtonTemplate("up", -1);
        if (state === "both")
            return html `
            ${this.moveButtonTemplate("up", -1)}
            ${this.moveButtonTemplate("down", 1)}
        `;
        else
            return nothing;
    }
    render() {
        return html `
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
    onSlideChanged(e) {
        const field = e.target.name;
        const { value } = e.target;
        const slideOrder = this.slide?.slideorder;
        const options = {
            detail: { action: "slideChanged", field, value, slideOrder },
            bubbles: true,
            composed: true
        };
        this.dispatchEvent(new CustomEvent('stateChanged', options));
    }
    onSlideOrderChanged(e) {
        if (!this.slide)
            return;
        const index = +(e.currentTarget.value);
        const { slideorder } = this.slide;
        const options = {
            detail: { action: "slideOrderChanged", oldSlideOrder: slideorder, newSlideOrder: slideorder + index },
            bubbles: true,
            composed: true
        };
        this.dispatchEvent(new CustomEvent('stateChanged', options));
    }
    onSlideDeleted(e) {
        if (!this.slide)
            return;
        const { slideorder } = this.slide;
        const options = {
            detail: { action: "slideDeleted", slideorder },
            bubbles: true,
            composed: true
        };
        this.dispatchEvent(new CustomEvent('stateChanged', options));
    }
};
__decorate([
    property({ type: Object })
], SlideFieldSet.prototype, "slide", void 0);
__decorate([
    property({ type: Array })
], SlideFieldSet.prototype, "soundUrls", void 0);
__decorate([
    property()
], SlideFieldSet.prototype, "moveButtonState", void 0);
SlideFieldSet = __decorate([
    customElement("slide-fieldset")
], SlideFieldSet);
export { SlideFieldSet };
//# sourceMappingURL=SlideFieldSet.js.map