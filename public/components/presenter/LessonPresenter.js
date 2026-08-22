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
        this.slides = [];
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

                .start{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height:100%;

                    p{
                        font-size:45px
                    }

                    button{
                            font-size: 30px;
                            padding: 5px 15px;
                    }
                }
            }
            `
    ]; }
    async connectedCallback() {
        super.connectedCallback();
        const res = await fetch(`./get/${this.lessonId}`);
        if (!res.ok)
            return this.status = "error";
        const lesson = await res.json();
        const slides = await this.getSlidesWithAudio(lesson);
        this.lesson = lesson;
        this.slides = slides;
        this.status = "lessonLoaded";
    }
    errorTemplate() {
        return html `<p>Something went wrong!</p>`;
    }
    loadingTemplate() {
        return html `<p>Loading.....</p>`;
    }
    lessonTemplate() {
        let currentSlide = { ...this.slides[this.slideIndex - 1] };
        return html `${html `<lesson-slide .slide=${currentSlide} @userActed=${this.userActedHandler}></lesson-slide>`}`;
    }
    lessonFinishedTemplate() {
        return html `
            <p>Congratulations! You are finished!</p>
            <a href="./">Go back to dashboard</a>
        `;
    }
    startLessonTemplate() {
        return html `
            <div class="start">
                <p>Let's get started!</p>
                <button @click=${this.handleStartLesson} >Ok</button>
            </div>
        `;
    }
    render() {
        const template = this.status === "error" ? this.errorTemplate()
            : this.status === "lessonLoaded" ? this.startLessonTemplate()
                : this.status === "start" ? this.lessonTemplate()
                    : this.status === "finished" ? this.lessonFinishedTemplate()
                        : this.loadingTemplate();
        return html `${template}`;
    }
    // In order to allow autoplay for audio recordings, user must click after page load
    handleStartLesson() {
        this.status = "start";
    }
    //TODO Implement S3 functionalality later
    async getSlidesWithAudio(lesson) {
        const { slides, id } = lesson;
        let lessonSlides;
        const response = await fetch(`/lessons/audiofiles/${id}`);
        const audioItems = await response.json();
        const audioItemsMap = new Map();
        audioItems.forEach(audioItem => audioItemsMap.set(audioItem.fileName, audioItem.url));
        lessonSlides = slides.map(async (slide) => {
            const url = audioItemsMap.get(slide.soundurl);
            if (url) {
                const response = await fetch(url);
                const blob = await response.blob();
                return { ...slide, sound: blob };
            }
            else
                return { ...slide, sound: null };
        });
        return await Promise.all(lessonSlides);
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
], LessonPresenter.prototype, "status", void 0);
__decorate([
    state()
], LessonPresenter.prototype, "slideIndex", void 0);
LessonPresenter = __decorate([
    customElement("lesson-presenter")
], LessonPresenter);
export { LessonPresenter };
//# sourceMappingURL=LessonPresenter.js.map