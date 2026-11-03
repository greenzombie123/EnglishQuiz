import { css, html, LitElement, nothing, PropertyValues } from "lit"
import { customElement, property, query, state } from "lit/decorators.js"
import { map } from "lit/directives/map.js"
import "./NameContainer.ts"
import "./GroupNameSelector.ts"
import "./SlideSelector.ts"
import "./SoundSelector.ts"
import "./SlideFieldSet.ts"
import "../MessageDialog.ts"
import "../audio/AudioInput.ts"
import { AudioFileDeleted, AudioFilesUpdated, LessonData, LessonDataChanged, SlideAdded, SlideChanged, SlideDeleted, SlideOrderChanged, StateChanged } from "./types.ts"

import { RecordingController } from "./RecordingController.ts"

import type { MessageDialog } from "../MessageDialog.ts"
import { DatabaseAction, IntroSlide, Lesson, LessonSlide, QuestionSlide, Recording } from "../types.ts"

import { v7 as createId } from "uuid"

export type MoveButtonState = "none" | "up" | "down" | "both"

const j: IntroSlide = { type: "intro", definition: "f", targetword: "f", slideorder: 1, id: createId(), lessonid: undefined, action: "add", recordings: [] }
const pog: QuestionSlide = { type: "question", question: "g", correctanswer: "x", wronganswer1: "b", wronganswer2: "", wronganswer3: "", id: createId(), lessonid: undefined, action: "add", slideorder: 2, recordings: [] }
const files = [new File(["fefe"], "wow.com"), new File(["ddef"], "hot.webm")]

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

    private recordingController = new RecordingController(this)

    @property({ type: Number })
    lessonId?: number

    tempLessonId = 0

    @state()
    private lessonName = "LOL"//""

    @state()
    private groupName = ""

    @state()
    private groupNameList: string[] = []

    @state()
    private slides: LessonSlide[] = [j, pog]

    private deleteSlideIds: { id: string, slideType: string }[] = []

    @state()
    private slideCount = 0

    classId?: number = undefined

    @query("message-dialog")
    messageDialog!: MessageDialog

    protected render() {

        return html`
       <h1>Create Your Lesson</h1>
        <form action="/lessons/createlesson" method="post" @stateChanged=${this.stateChangedHandler}>
            <div class="top">
                <div class="nameContainer">

                    <name-container lessonName=${this.lessonName}></name-container>

                    <groupname-selector groupName=${this.groupName} .groupNameList=${this.groupNameList}></groupname-selector>

                </div>

                <audio-input .recordings=${this.recordingController.recordings}></audio-input>

            </div>

            <div class="breakLine" style="width: 100%; border: 2px solid black;"></div>

            <!-- FieldSets -->
            ${map(this.slides, (slide, index) => html`<slide-fieldset moveButtonState=${this.setMoveButtonState(index, this.slides.length)} .slide=${slide} .recordings=${this.recordingController.recordings}></slide-fieldset>`)}

            <slide-selector></slide-selector>

            <button type="button" class="submit" @click=${this.sendLesson}>${!this.lessonId ? "Create Lesson" : "Finish editing lesson"}</button>

            <message-dialog .url=${"/lessons"} .message=${"The lesson was successfully created."} .linkText=${"Return to Dashboard"}></message-dialog>
        </form>
    `
    }

    protected async firstUpdated(_changedProperties: PropertyValues) {
        if (this.lessonId) {
            await this.getLesson(this.lessonId)
            //
        }
        else this.lessonId = undefined
        await this.getGroupNames()
    }

    private async getLesson(lessonId: number) {

        const response = await fetch(`/lessons/get/${lessonId}`)

        if (!response.ok) return

        const lesson = await response.json() as Lesson

        this.lessonName = lesson.name
        this.groupName = lesson.groupname
        this.slideCount = lesson.slides.length
        this.slides = [...lesson.slides]

        this.recordingController.retrieveRecordings(this.slides)
    }

    private async sendLesson() {
        //TODO Add feature that tells user that they must create at least one slide before creating lesson
        if (this.slides.length === 0) return

        const recordings = await this.recordingController.prepareRecordings(this.slides)

        const lesson = this.createLesson(this.lessonId)

        await this.recordingController.processUnattachedRecordingsForDeletion(this.slides)
        await this.recordingController.deleteRecordingFromStorage()
        await this.recordingController.deleteRecordingsFromDatabase()

        await this.recordingController.sendRecordingsToStorage(recordings)
        await this.recordingController.sendRecordingsToDatabase(recordings)

        // Add or update lesson in database
        const response = await fetch("/lessons/createlesson", {
            method: "POST",
            body: JSON.stringify(lesson),
            headers: { "Content-Type": "application/json" }
        })

        if (!response.ok) return

        this.messageDialog.open({
            text: `${this.lessonId ? "Your lesson has successfully updated." : "The lesson was created."}`,
            link: "/lessons",
            buttonText: "Return to the dashboard"
        })
    }

    private async getGroupNames() {
        const response = await fetch(`/lessons/groupnames`)

        if (!response.ok) return

        const groupnames = await response.json() as string[]

        this.groupNameList = [...groupnames]
    }

    private createLesson(lessonId: number | undefined) {

        let intro: IntroSlide[] = this.slides.filter(slide => slide.type === "intro")
        let question: QuestionSlide[] = this.slides.filter(slide => slide.type === "question")

        const lesson: LessonData = {
            id: lessonId,
            name: this.lessonName,
            groupname: this.groupName,
            intro,
            question,
            deleteSlideIds: this.deleteSlideIds
        }

        return lesson
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

        const id: string = createId()
        const action: DatabaseAction = "add"

        if (slideType === "intro") {
            const slide: IntroSlide = {
                type: "intro",
                slideorder: this.slideCount,
                targetword: "",
                definition: "",
                lessonid: this.lessonId,
                id,
                action,
                recordings: []
            }

            this.slides = [...this.slides, slide]
        }

        else if (slideType === "question") {
            const slide: QuestionSlide = {
                type: "question",
                slideorder: this.slideCount,
                question: "",
                correctanswer: "",
                wronganswer1: "",
                wronganswer2: "",
                wronganswer3: "",
                lessonid: this.lessonId || this.tempLessonId,
                id,
                action,
                recordings: []
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

        const { slideorder, id, slideType, databaseAction } = state

        if (databaseAction === "update") {
            this.deleteSlideIds.push({ id, slideType })
        }

        const newSlides = this.slides
            .filter(slide => slide.slideorder !== slideorder)
            .map((slide, index) => { return { ...slide, slideorder: index + 1 } })


        this.slides = [...newSlides]
    }

    private audioFilesUpdatedHandler(state: AudioFilesUpdated) {
        this.recordingController.setRecording(state.recording)
    }

    private async audioFileDeletedHandler(state: AudioFileDeleted) {

        const { name, id } = state

        const userResponse = await this.messageDialog.getUserResponse({ text: `Delete this recording: ${name} ?`, link: undefined })

        if (userResponse.response === "Yes") {
            this.recordingController.removeRecording(id)
            this.slides = this.recordingController.removeRecordingFromSlides(this.slides, id)
        }
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
            case "audioFilesUpdated":
                this.audioFilesUpdatedHandler(newState)
                break;
            case "audioFileDeleted":
                this.audioFileDeletedHandler(newState)
                break;
            default:
                break;
        }
    }
}
