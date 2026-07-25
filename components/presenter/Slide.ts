import { LitElement, html, css, nothing, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { introSlideStyle, questionSlideStyle, slideStyle } from "./styles.ts";
import { IntroSlideData, QuestionSlideData, SlideData } from "../types.ts";
import { choose } from "lit/directives/choose.js";
import { UserActed, UserActedKeyValue } from "./types.ts";

@customElement("lesson-slide")
export class Slide extends LitElement {
    static styles = [
        introSlideStyle,
        questionSlideStyle,
        slideStyle
    ];

    @property({ type: Object })
    slide?: SlideData

    public introSlideTemplate() {

        const classes = { intro: true, question: false }

        const { targetword, definition } = this.slide as IntroSlideData

        const nextButton = html`<button type="button" class="next" @click=${() => this.userClicked("nextSlide")}>Next</button>`

        // Determine if previousButton should be rendered
        const previousButton = this.slide?.slideorder !== 1 ? html`<button type="button" class="next" @click=${() => this.userClicked("previousSlide")}>Previous</button>` : html`${nothing}`

        return html` 
        <div class=${classMap(classes)}>
            <div class="targetWord">${targetword}</div>
            <div class="definition">${definition}</div>
        </div>
        <div class="buttons">
            ${[previousButton, nextButton]}
        </div>
      `
    }

    public questionSlideTemplate() {

        const classes = { intro: false, question: true }

        const { question, correctanswer, wronganswer1, wronganswer2, wronganswer3 } = this.slide as QuestionSlideData

        const buttons = [
            html`<button type="button" @click=${() => this.userClicked("correct")}>${correctanswer}</button>`,
            html`<button type="button" @click=${() => this.userClicked("wrong")}>${wronganswer1}</button>`,
            html`${wronganswer2 ? html`<button type="button" @click=${() => this.userClicked("wrong")}>${wronganswer2}</button>` : nothing}`,
            html`${wronganswer3 ? html`<button type="button" @click=${() => this.userClicked("wrong")}>${wronganswer3}</button>` : nothing}`
        ]

        const sortedButtons = this.shuffle(buttons)

        return html`
            <p class=${classMap(classes)}>${question}</p>
            <div class="buttons">
                ${sortedButtons}
            </div>
        `
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

    protected render() {

        return html` ${choose(this.slide?.type, [
            ["question", () => this.questionSlideTemplate()],
            ["intro", () => this.introSlideTemplate()]
        ])
            }
    `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "lesson-slide": Slide;
    }
}
