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
        const lesson = await this.getLesson(this.lessonId);
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
    async getLesson(lessonId) {
        if (!lessonId)
            throw new Error("Couldn't get lesson");
        const res = await fetch(`./get/${lessonId}`);
        if (!res.ok)
            throw new Error('Something happened');
        const lesson = await res.json();
        return lesson;
    }
    async getRecording(key) {
        try {
            const res1 = await fetch(`/audio/${key}`);
            const recording = await res1.json();
            const res2 = await fetch(recording.url);
            return await res2.blob();
        }
        catch (error) {
            console.error(error);
            throw new Error("Something went wrong");
        }
    }
    // In order to allow autoplay for audio recordings, user must click after page load
    handleStartLesson() {
        this.status = "start";
    }
    //TODO Implement S3 functionalality later
    async getSlidesWithAudio(lesson) {
        let lessonSlides;
        //TODO Change for sentence slides later
        const slidesWithRecordings = lesson.slides.filter(slide => slide.recordings[0]);
        lessonSlides = slidesWithRecordings.map(async (slide) => {
            const recordingId = slide.recordings[0];
            const recording = await this.getRecording(recordingId);
            return { ...slide, recording };
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