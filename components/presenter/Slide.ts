import { LitElement, html, css, nothing, TemplateResult, PropertyValues } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { introSlideStyle, questionSlideStyle, slideStyle } from "./styles.ts";
import { IntroSlideData, QuestionSlideData, SlideData } from "../types.ts";
import { choose } from "lit/directives/choose.js";
import { Intro, LessonSlide, Question, UserActed, UserActedKeyValue } from "./types.ts";

@customElement("lesson-slide")
export class Slide extends LitElement {
    static styles = [
        introSlideStyle,
        questionSlideStyle,
        slideStyle
    ];

    @property({ type: Object })
    slide?: LessonSlide

    @query("audio")
    _audio?: HTMLAudioElement

    public introSlideTemplate() {

        const classes = { intro: true, question: false }

        const { targetword, definition } = this.slide as Intro

        const nextButton = html`<button type="button" class="next" @click=${() => this.userClicked("nextSlide")}>Next</button>`

        // Determine if previousButton should be rendered
        const previousButton = this.slide?.slideorder !== 1 ? html`<button type="button" class="next" @click=${() => this.userClicked("previousSlide")}>Previous</button>` : html`${nothing}`

        return html` 
        <div class=${classMap(classes)}>
            <div class="targetWord" @click=${this.handlePlaySound}>${targetword}</div>
            <div class="definition">${definition}</div>
        </div>
        <div class="buttons">
            ${[previousButton, nextButton]}
        </div>
      `
    }

    public questionSlideTemplate() {

        const classes = { intro: false, question: true }

        const { question, correctanswer, wronganswer1, wronganswer2, wronganswer3 } = this.slide as Question

        const buttons = [
            html`<button type="button" @click=${() => this.userClicked("correct")}>${correctanswer}</button>`,
            html`<button type="button" @click=${() => this.userClicked("wrong")}>${wronganswer1}</button>`,
            html`${wronganswer2 ? html`<button type="button" @click=${() => this.userClicked("wrong")}>${wronganswer2}</button>` : nothing}`,
            html`${wronganswer3 ? html`<button type="button" @click=${() => this.userClicked("wrong")}>${wronganswer3}</button>` : nothing}`
        ]

        const sortedButtons = this.shuffle(buttons)

        return html`
            <p class=${classMap(classes)} @click=${this.handlePlaySound}>${question}</p>
            <div class="buttons">
                ${sortedButtons}
            </div>
        `
    }

    private handlePlaySound() {
        if(this._audio?.src) this._audio.play()
    }

    private userClicked(status: UserActedKeyValue) {

        const customEventInit: CustomEventInit<UserActed> = {
            bubbles: true,
            composed: true,
            detail: { action: status }
        }

        this.dispatchEvent(new CustomEvent("userActed", customEventInit))
    }

    private shuffle = (array: TemplateResult[]) => array.sort(() => Math.random() - 0.5);   

    // Whenever the slide is updated, remove the old audio, add the new one and play it on render.
    protected updated(_changedProperties: PropertyValues): void {
        if (this._audio?.src) {
            URL.revokeObjectURL(this._audio.src)
        }


        if (this._audio && this.slide?.sound) {

            this._audio.src = URL.createObjectURL(this.slide.sound)

            setTimeout(() => { this._audio?.play() }, 200)
        }
    }

    protected render() {

        return html` ${choose(this.slide?.type, [
            ["question", () => this.questionSlideTemplate()],
            ["intro", () => this.introSlideTemplate()]
        ])
            }
        <audio></audio>
    `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "lesson-slide": Slide;
    }
}
