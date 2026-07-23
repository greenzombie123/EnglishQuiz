import { css, html, LitElement, nothing } from "lit"
import { customElement, property, query, state } from "lit/decorators.js"
import "./NameContainer.ts"
import "./GroupNameSelector.ts"
import "./SlideSelector.ts"
import "./SoundSelector.ts"
import "./SlideFieldSet.ts"
import { map } from "lit/directives/map.js"
import { IntroSlideData, LessonData, LessonDataChanged, LessonRecord, QuestionSlideData, SlideAdded, SlideChanged, SlideData, SlideDeleted, SlideOrderChanged, StateChanged } from "./types.ts"
import { Task } from "@lit/task"
import "../MessageDialog.ts"

import type { MessageDialog } from "../MessageDialog.ts"

export type MoveButtonState = "none" | "up" | "down" | "both"

const j = { slidetype: "intro", definition: "f", targetword: "f", slideorder: 1, soundurl: "f" }

@customElement("lesson-creator")
export class LessonCreator extends LitElement {

    static styles = css`
            h1 {
                text-align: center;
                border-bottom: 1px black solid;
                padding: 10px;
                background-color: rgb(248, 248, 109);
                margin: 0;
            }

            form {
                --itemWidth: 33vw;
                --fontSize: 1.1rem;
                --inputPadding: 5px;

                padding: 20px;

                .top {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    padding-bottom: 20px;

                    .nameContainer {

                        .lessonNameLabel {
                            display: flex;
                            flex-direction: column;
                            width: 450px;
                            font-size: var(--fontSize);
                            gap: 10px;
                            margin-bottom: 10px;

                            input {
                                font-size: var(--fontSize);
                                padding: var(--inputPadding);
                            }
                        }
                    }
                }


                .slideSelecter {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    width: fit-content;
                    border: 1px black solid;
                    margin: 25px 0;
                    padding: 10px;

                    label {
                        font-size: var(--fontSize)
                    }

                    select {
                        font-size: var(--fontSize)
                    }

                    /* button {} */
                }

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

                .submit {
                    font-size: 1.1rem;
                }
            }

            @media screen and (max-width:600px) {
                form {
                    --fontSize: 1rem;
                    --inputPadding: 5px;
                    --inputWidth: 100%;

                    label,
                    input {
                        font-size: var(--fontSize);
                    }

                    .lessonNameLabel,
                    groupname-selecter,
                    .slide-fieldSet {
                        width: var(--inputWidth);
                    }

                    groupname-selecter {
                        font-size: var(--fontSize);
                    }
                }
            }
`

    @property({ type: Number })
    lessonId?: number

    @state()
    private lessonName = ""

    @state()
    private groupName = ""

    @state()
    private groupNameList: string[] = []

    @state()
    private slides: SlideData[] = []

    @state()
    private slideCount = 0

    @state()
    private soundUrls: string[] = []

    @query("message-dialog")
    messageDialog!: MessageDialog

    private sendLessonTask = new Task(this, {
        task: async () => {

            const lesson = this.createLesson()

            const response = await fetch("/lessons/createlesson", {
                method: "POST",
                body: JSON.stringify(lesson),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (!response.ok) return

            this.messageDialog.open()
        }
    })

    private getLessonTask = new Task(this, {
        task: async () => {
            const response = await fetch(`/lessons/get/${this.lessonId}`)

            if(!response.ok) return

            const lesson = await response.json() as LessonRecord

            this.lessonName = lesson.name
            this.groupName = lesson.groupname
            this.slideCount = lesson.slides.length
            this.slides = [...lesson.slides] 
        },
        args:()=>[]
    })

    private getGroupNames = new Task(this, {
        task: async () => {
            const response = await fetch(`/lessons/groupnames`)

            if (!response.ok) return

            const groupnames = await response.json() as string[]

            this.groupNameList = [...groupnames]
        },
        args: () => []
    })

    protected render() {

        return html`
       <h1>Create Your Lesson</h1>
        <form action="/lessons/createlesson" method="post" @stateChanged=${this.stateChangedHandler}>
            <div class="top">
                <div class="nameContainer">

                    <name-container lessonName=${this.lessonName}></name-container>

                    <groupname-selector groupName=${this.groupName} .groupNameList=${this.groupNameList}></groupname-selector>

                </div>

                <!-- <audio-input></audio-input> -->

            </div>

            <div class="breakLine" style="width: 100%; border: 2px solid black;"></div>

            <!-- FieldSets -->

            ${map(this.slides, (slide, index) => html`<slide-fieldset moveButtonState=${this.setMoveButtonState(index, this.slides.length)} .slide=${slide} .soundUrls=${this.soundUrls}></slide-fieldset>`)}

            <slide-selector></slide-selector>

            <button type="button" class="submit" @click=${this.sendLessonHandler}>Create Lesson</button>

        </form>

        <message-dialog .url=${"/lessons"} .message=${"The lesson was successfully created."} .linkText=${"Return to Dashboard"}></message-dialog>
    `
    }

    private createLesson() {

        const intro: IntroSlideData[] = this.slides.filter(slide => slide.type === "intro")
        const question: QuestionSlideData[] = this.slides.filter(slide => slide.type === "question")

        const lesson: LessonData = {
            id: this.lessonId,
            name: this.lessonName,
            groupname: this.groupName,
            intro,
            question
        }

        return lesson
    }

    private sendLessonHandler() {
        if (this.slides.length > 0) {
            this.sendLessonTask.run()
        }
    }

    private setMoveButtonState(slideIndex: number, maxSlides: number): MoveButtonState {
        slideIndex++
        if (maxSlides === 1) return "none"
        if (slideIndex === 1) return "down"
        if (slideIndex === maxSlides) return "up"
        else return "both"
    }

    private slideOrderChangedHandler(state: SlideOrderChanged) {
        const slides = [...this.slides]

        const { oldSlideOrder: o, newSlideOrder: n } = state

        const newSlides = slides.map(slide => {
            if (slide.slideorder === o) {
                return { ...slide, slideorder: n }
            }

            else if (slide.slideorder === n) {
                return { ...slide, slideorder: o }
            }

            else return slide
        })

        newSlides.sort((a, b) => a.slideorder - b.slideorder)

        this.slides = [...newSlides]
    }

    private lessonDataChangedHandler(state: LessonDataChanged) {

        if (state.field === "lessonName") this.lessonName = state.value
        else if (state.field === "groupName") this.groupName = state.value
    }

    private slideAddedHandler(state: SlideAdded) {

        const slideType = state.value

        this.slideCount = this.slideCount + 1

        if (slideType === "intro") {
            const slide: SlideData = {
                type: "intro",
                slideorder: this.slideCount,
                targetword: "",
                definition: "",
                soundurl: ""
            }

            this.slides = [...this.slides, slide]
        }

        else if (slideType === "question") {
            const slide: SlideData = {
                type: "question",
                slideorder: this.slideCount,
                question: "",
                correctanswer: "",
                wronganswer1: "",
                wronganswer2: "",
                wronganswer3: "",
                soundurl: ""
            }

            this.slides = [...this.slides, slide]
        }
    }

    private slideChangedHandler(state: SlideChanged) {
        const slides = [...this.slides]

        const newSlides = slides.map(slide => {
            if (slide.slideorder === state.slideOrder) {
                return {
                    ...slide, [state.field]: state.value
                }
            }
            else return slide
        })

        this.slides = [...newSlides]
    }

    private slideDeletedHandler(state: SlideDeleted) {

        const { slideorder } = state

        const newSlides = this.slides
            .filter(slide => slide.slideorder !== slideorder)
            .map((slide, index) => { return { ...slide, slideorder: index + 1 } })


        this.slides = [...newSlides]
    }

    private stateChangedHandler(e: CustomEvent<StateChanged>) {

        const newState = e.detail

        switch (newState.action) {
            case "lessonDataChanged":
                this.lessonDataChangedHandler(newState)
                break;
            case "slideChanged":
                this.slideChangedHandler(newState)
                break;
            case "slideAdded":
                this.slideAddedHandler(newState)
                break;
            case "slideOrderChanged":
                this.slideOrderChangedHandler(newState)
                break;
            case "slideDeleted":
                this.slideDeletedHandler(newState)
                break;
            default:
                break;
        }
    }
}
