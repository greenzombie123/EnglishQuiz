var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./Slide.js";
let LessonPresenter = class LessonPresenter extends LitElement {
    constructor() {
        super(...arguments);
        this.status = "loading";
        this.slideIndex = 1;
        this.userCorrectHandler = () => {
            if (this.isLastSlide())
                return this.lessonFinishedHandler();
            this.slideIndex = ++this.slideIndex;
        };
        this.nextSlideHandler = () => {
            if (this.isLastSlide())
                return this.lessonFinishedHandler();
            this.slideIndex = ++this.slideIndex;
        };
        this.previousSlideHandler = () => this.slideIndex = --this.slideIndex;
        this.isLastSlide = () => this.slideIndex === this.lesson?.slides.length;
    }
    static { this.styles = [
        css `
            :host {
                flex: 1;
                display: flex;
                flex-direction: column;
            `
    ]; }
    async connectedCallback() {
        super.connectedCallback();
        const res = await fetch(`./get/${this.lessonId}`);
        if (!res.ok)
            this.status = "error";
        this.lesson = await res.json();
        this.status = "lessonLoaded";
    }
    errorTemplate() {
        return html `<p>Something went wrong!</p>`;
    }
    loadingTemplate() {
        return html `<p>Loading.....</p>`;
    }
    lessonTemplate() {
        const currentSlide = this.lesson?.slides[this.slideIndex - 1];
        return html `<lesson-slide .slide=${currentSlide} @userActed=${this.userActedHandler}></lesson-slide>`;
    }
    lessonFinishedTemplate() {
        return html `
            <p>Congratulations! You are finished!</p>
            <a href="./">Go back to dashboard</a>
        `;
    }
    render() {
        const template = this.status === "error" ? this.errorTemplate()
            : this.status === "lessonLoaded" ? this.lessonTemplate()
                : this.status === "finished" ? this.lessonFinishedTemplate()
                    : this.loadingTemplate();
        return html `${template}`;
    }
    userWrongHandler() {
        // if the question slide is the first slide, force an update to reshuffle the questions
        if (this.slideIndex === 1)
            this.requestUpdate();
        else
            this.slideIndex = --this.slideIndex;
    }
    lessonFinishedHandler() {
        this.status = "finished";
    }
    userActedHandler(e) {
        const { detail } = e;
        switch (detail.action) {
            case "correct":
                this.userCorrectHandler();
                break;
            case "wrong":
                this.userWrongHandler();
                break;
            case "nextSlide":
                this.nextSlideHandler();
                break;
            case "previousSlide":
                this.previousSlideHandler();
                break;
            default:
                break;
        }
    }
};
__decorate([
    property({ type: Number })
], LessonPresenter.prototype, "lessonId", void 0);
__decorate([
    state()
], LessonPresenter.prototype, "lesson", void 0);
__decorate([
    state()
], LessonPresenter.prototype, "status", void 0);
__decorate([
    state()
], LessonPresenter.prototype, "slideIndex", void 0);
LessonPresenter = __decorate([
    customElement("lesson-presenter")
], LessonPresenter);
export { LessonPresenter };
//# sourceMappingURL=LessonPresenter.js.map