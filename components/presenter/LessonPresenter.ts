import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js"
import { cache } from 'lit/directives/cache.js'
import "./Slide.ts"
import type { Lesson, SlideData } from "../types.ts";
import type { LessonSlide, UserActed } from "./types.ts"

type LessonState = "loading" | "error" | "finished" | "lessonLoaded" | "start"

@customElement("lesson-presenter")
export class LessonPresenter extends LitElement {
    static styles = [
        css`
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
    ];

    @property({ type: Number })
    lessonId?: number

    lesson?: Lesson

    slides: LessonSlide[] = []

    @state()
    status: LessonState = "loading"

    @state()
    slideIndex = 1

    async connectedCallback() {
        super.connectedCallback()

        const res = await fetch(`./get/${this.lessonId}`)
        if (!res.ok) return this.status = "error"
        const lesson = await res.json()
        const slides = await this.getSlidesWithAudio(lesson)
        this.lesson = lesson
        this.slides = slides
        console.log(this.slides)
        this.status = "lessonLoaded"
    }

    errorTemplate() {
        return html`<p>Something went wrong!</p>`
    }

    loadingTemplate() {
        return html`<p>Loading.....</p>`
    }

    lessonTemplate() {
        let currentSlide = { ...this.slides[this.slideIndex - 1] }

        return html`${html`<lesson-slide .slide=${currentSlide} @userActed=${this.userActedHandler}></lesson-slide>`}`
    }

    lessonFinishedTemplate() {
        return html`
            <p>Congratulations! You are finished!</p>
            <a href="./">Go back to dashboard</a>
        `
    }

    startLessonTemplate() {
        return html`
            <div class="start">
                <p>Let's get started!</p>
                <button @click=${this.handleStartLesson} >Ok</button>
            </div>
        `
    }

    render() {

        const template = this.status === "error" ? this.errorTemplate()
            : this.status === "lessonLoaded" ? this.startLessonTemplate()
                : this.status === "start" ? this.lessonTemplate()
                    : this.status === "finished" ? this.lessonFinishedTemplate()
                        : this.loadingTemplate()

        return html`${template}`;
    }

    // In order to allow autoplay for audio recordings, user must click after page load
    private handleStartLesson() {
        this.status = "start"
    }

    //TODO Implement S3 functionalality later
    private async getSlidesWithAudio(lesson: Lesson) {

        const { slides } = lesson

        const slidesWithAudio = await Promise.all<LessonSlide>(slides.map<Promise<LessonSlide>>(async slide => {
            const res = await fetch("/lessons/audiofiles")
            const sound = await res.blob()

            if (slide.type === "intro") {
                const { targetword, definition, slideorder, type } = slide

                return { targetword, definition, slideorder, type, sound }
            }

            // if slideType is "question"
            else {
                const { question, correctanswer, wronganswer1, wronganswer2, wronganswer3, slideorder, type } = slide

                return { question, correctanswer, wronganswer1, wronganswer2, wronganswer3, slideorder, type, sound }
            }
        }))

        return slidesWithAudio
    }

    private userCorrectHandler = () => {
        if (this.isLastSlide()) return this.lessonFinishedHandler()
        this.slideIndex = ++this.slideIndex
    }

    private userWrongHandler() {
        // if the question slide is the first slide, force an update to reshuffle the questions
        if (this.slideIndex === 1) this.requestUpdate()
        else this.slideIndex = --this.slideIndex
    }

    private nextSlideHandler = () => {
        if (this.isLastSlide()) return this.lessonFinishedHandler()
        this.slideIndex = ++this.slideIndex
    }

    private previousSlideHandler = () => this.slideIndex = --this.slideIndex


    private lessonFinishedHandler() {
        this.status = "finished"
    }

    private isLastSlide = () => this.slideIndex === this.lesson?.slides.length

    userActedHandler(e: CustomEvent<UserActed>) {

        const { detail } = e

        switch (detail.action) {

            case "correct":
                this.userCorrectHandler()
                break;

            case "wrong":
                this.userWrongHandler()
                break;

            case "nextSlide":
                this.nextSlideHandler()
                break;

            case "previousSlide":
                this.previousSlideHandler()
                break;

            default:
                break;
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "lesson-presenter": LessonPresenter;
    }
}
