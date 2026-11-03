import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js"
import "./Slide.ts"
import type { Lesson, Recording } from "../types.ts";
import type { CurrentLesson, Intro, LessonPresenterSlide, Question, UserActed } from "./types.ts"

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

    lesson?: CurrentLesson

    slides: (Intro | Question)[] = []

    @state()
    status: LessonState = "loading"

    @state()
    slideIndex = 1

    async connectedCallback() {
        super.connectedCallback()

        const lesson = await this.getLesson(this.lessonId)
        const slides = await this.getSlidesWithAudio(lesson)
        this.lesson = lesson
        this.slides = slides
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

    private async getLesson(lessonId: number | undefined) {
        if (!lessonId) throw new Error("Couldn't get lesson")
        const res = await fetch(`./get/${lessonId}`)
        if(!res.ok) throw new Error('Something happened')
        const lesson: CurrentLesson = await res.json()
        return lesson
    }

    private async getRecording(key:string){
        try {
            const res1 = await fetch(`/audio/${key}`)
            const recording:Recording = await res1.json()
            const res2 = await fetch(recording.url)
            return await res2.blob()
        } catch (error) {
            console.error(error)
            throw new Error("Something went wrong")
        }
    }

    // In order to allow autoplay for audio recordings, user must click after page load
    private handleStartLesson() {
        this.status = "start"
    }

    //TODO Implement S3 functionalality later
    private async getSlidesWithAudio(lesson: CurrentLesson) {

        let lessonSlides: Promise<LessonPresenterSlide>[]

        //TODO Change for sentence slides later
        const slidesWithRecordings = lesson.slides.filter(slide=> slide.recordings[0])

        lessonSlides = slidesWithRecordings.map(async (slide)=>{
            const recordingId = slide.recordings[0]
            const recording = await this.getRecording(recordingId) 
            return {...slide, recording}
        })

        return await Promise.all(lessonSlides)
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
