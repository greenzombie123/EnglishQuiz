var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { introSlideStyle, questionSlideStyle, slideStyle } from "./styles.js";
import { choose } from "lit/directives/choose.js";
let Slide = class Slide extends LitElement {
    constructor() {
        super(...arguments);
        this.shuffle = (array) => array.sort(() => Math.random() - 0.5);
    }
    static { this.styles = [
        introSlideStyle,
        questionSlideStyle,
        slideStyle
    ]; }
    introSlideTemplate() {
        const classes = { intro: true, question: false };
        const { targetword, definition } = this.slide;
        const nextButton = html `<button type="button" class="next" @click=${() => this.userClicked("nextSlide")}>Next</button>`;
        // Determine if previousButton should be rendered
        const previousButton = this.slide?.slideorder !== 1 ? html `<button type="button" class="next" @click=${() => this.userClicked("previousSlide")}>Previous</button>` : html `${nothing}`;
        return html ` 
        <div class=${classMap(classes)}>
            <div class="targetWord">${targetword}</div>
            <div class="definition">${definition}</div>
        </div>
        <div class="buttons">
            ${[previousButton, nextButton]}
        </div>
      `;
    }
    questionSlideTemplate() {
        const classes = { intro: false, question: true };
        const { question, correctanswer, wronganswer1, wronganswer2, wronganswer3 } = this.slide;
        const buttons = [
            html `<button type="button" @click=${() => this.userClicked("correct")}>${correctanswer}</button>`,
            html `<button type="button" @click=${() => this.userClicked("wrong")}>${wronganswer1}</button>`,
            html `${wronganswer2 ? html `<button type="button" @click=${() => this.userClicked("wrong")}>${wronganswer2}</button>` : nothing}`,
            html `${wronganswer3 ? html `<button type="button" @click=${() => this.userClicked("wrong")}>${wronganswer3}</button>` : nothing}`
        ];
        const sortedButtons = this.shuffle(buttons);
        return html `
            <p class=${classMap(classes)}>${question}</p>
            <div class="buttons">
                ${sortedButtons}
            </div>
        `;
    }
    userClicked(status) {
        const customEventInit = {
            bubbles: true,
            composed: true,
            detail: { action: status }
        };
        this.dispatchEvent(new CustomEvent("userActed", customEventInit));
    }
    render() {
        return html ` ${choose(this.slide?.type, [
            ["question", () => this.questionSlideTemplate()],
            ["intro", () => this.introSlideTemplate()]
        ])}
    `;
    }
};
__decorate([
    property({ type: Object })
], Slide.prototype, "slide", void 0);
Slide = __decorate([
    customElement("lesson-slide")
], Slide);
export { Slide };
//# sourceMappingURL=Slide.js.map