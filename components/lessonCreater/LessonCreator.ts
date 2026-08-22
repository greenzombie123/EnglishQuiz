import { css, html, LitElement, nothing, PropertyValues } from "lit"
import { customElement, property, query, state } from "lit/decorators.js"
import { map } from "lit/directives/map.js"
import "./NameContainer.ts"
import "./GroupNameSelector.ts"
import "./SlideSelector.ts"
import "./SoundSelector.ts"
import "./SlideFieldSet.ts"
import "../MessageDialog.ts"
import { AudioFileDeleted, AudioFilesUpdated, LessonData, LessonDataChanged, SlideAdded, SlideChanged, SlideDeleted, SlideOrderChanged, StateChanged } from "./types.ts"
import "../audio/AudioInput.ts"

import type { MessageDialog } from "../MessageDialog.ts"
import { IntroSlideData, LessonRecord, QuestionSlideData, SlideData } from "../types.ts"

export type MoveButtonState = "none" | "up" | "down" | "both"

const j = { slidetype: "intro", definition: "f", targetword: "f", slideorder: 1, soundurl: "f" }
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
    private audioFiles: File[] = []

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

                <audio-input .audioFiles=${this.audioFiles}></audio-input>

            </div>

            <div class="breakLine" style="width: 100%; border: 2px solid black;"></div>

            <!-- FieldSets -->
            ${map(this.slides, (slide, index) => html`<slide-fieldset moveButtonState=${this.setMoveButtonState(index, this.slides.length)} .slide=${slide} .soundUrls=${this.audioFiles.map(audioFile => audioFile.name)}></slide-fieldset>`)}

            <slide-selector></slide-selector>

            <button type="button" class="submit" @click=${this.sendLesson}>${!this.lessonId ? "Create Lesson" : "Finish editing lesson"}</button>

            <message-dialog .url=${"/lessons"} .message=${"The lesson was successfully created."} .linkText=${"Return to Dashboard"}></message-dialog>
        </form>
    `
    }

    protected async firstUpdated(_changedProperties: PropertyValues) {
        if (this.lessonId) {
            await this.getLesson(this.lessonId)
        }
        await this.getGroupNames()
    }

    private async getAudioFiles(lessonId: number): Promise<File[]> {
        const response = await fetch(`/lessons/audiofiles/${lessonId}`)

        const audioItems: { fileName: string, url: string }[] = await response.json()

        return await Promise.all(audioItems.map(async (audioItem) => {
            const response = await fetch(audioItem.url)
            const blob = await response.blob()
            const file = new File([blob], audioItem.fileName)
            return file
        }))
    }


    private async sendAudioFiles(audioItems: { fileName: string, url: string }[], audioFiles: File[]) {

        if (!audioFiles.length) return

        const audioItemMap = new Map<string, string>()

        audioItems.forEach(audioItem => {
            audioItemMap.set(audioItem.fileName, audioItem.url)
        })

        const fileAndUrls: { url: string, file: File }[] = []

        audioFiles.forEach(audioFile => {

            const url = audioItemMap.get(audioFile.name)

            if (url) {

                const file = audioFile

                const fileAndUrl: { url: string, file: File } = { url, file }

                fileAndUrls.push(fileAndUrl)
            }

        })

        await Promise.all(fileAndUrls.map(async (fileAndUrl) => {
            await fetch(fileAndUrl.url, {
                method: "PUT",
                body: fileAndUrl.file
            })
        }))
    }

    private async createPresignedUrls(audioFiles: File[], lessonId: number, slides: SlideData[]) {

        const soundUrls = new Set(slides.map(slide => slide.soundurl))

        const soundUrlsToSend: string[] = []

        audioFiles.forEach(audioFile => {
            if (soundUrls.has(audioFile.name)) soundUrlsToSend.push(audioFile.name)

            console.log(audioFiles.map(g => g.name), slides.map(slide => slide.soundurl))
        })

        if (!soundUrlsToSend.length) return []

        const response = await fetch("/lessons/audiofiles", {
            method: "POST",
            body: JSON.stringify({ fileNames: soundUrlsToSend, lessonId }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const audioItems: { fileName: string, url: string }[] = await response.json()

        return audioItems
    }

    private async getLesson(lessonId: number) {

        const response = await fetch(`/lessons/get/${lessonId}`)

        if (!response.ok) return

        const lesson = await response.json() as LessonRecord

        this.lessonName = lesson.name
        this.groupName = lesson.groupname
        this.slideCount = lesson.slides.length
        this.slides = [...lesson.slides]

        const soundUrls: string[] = this.slides.map(slide => slide.soundurl)

        if (soundUrls.length) {
            this.audioFiles = await this.getAudioFiles(lessonId)
        }
    }

    private async sendLesson() {
        //TODO Add feature that tells user that they must create at least one slide before creating lesson
        if (this.slides.length === 0) return

        //TODO Check if there lessonId. Also, flag if lesson is new
        let lessonId: number
        let isLessonNew: boolean

        // lesson is not new if its a 0
        if (this.lessonId) {
            lessonId = this.lessonId
            isLessonNew = false
        } else {
            lessonId = await this.makeLesson(this.lessonName, this.groupName)
            isLessonNew = true
        }

        const audioItems: { fileName: string, url: string }[] = await this.createPresignedUrls(this.audioFiles, lessonId, this.slides)

        if (audioItems.length) await this.sendAudioFiles(audioItems, this.audioFiles)

        const lesson = this.createLesson(lessonId, isLessonNew)

        const response = await fetch("/lessons/createlesson", {
            method: "POST",
            body: JSON.stringify(lesson),
            headers: {
                "Content-Type": "application/json"
            }
        })

        console.log(response.statusText)

        if (!response.ok) return

        this.messageDialog.open({
            text: `${this.lessonId ? "Your lesson has successfully updated." : "The lesson was created."}`,
            link: "/lessons",
            buttonText: "Return to the dashboard"
        })
    }

    private async makeLesson(name: string, groupname: string): Promise<number> {
        const response = await fetch("/lessons/createjustlesson", {
            method: "POST",
            body: JSON.stringify({ name, groupname }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const lessonId: number = await response.json()

        return lessonId
    }

    private async getGroupNames() {
        const response = await fetch(`/lessons/groupnames`)

        if (!response.ok) return

        const groupnames = await response.json() as string[]

        this.groupNameList = [...groupnames]
    }

    private createLesson(lessonId: number, isLessonNew: boolean) {

        const intro: IntroSlideData[] = this.slides.filter(slide => slide.type === "intro")
        const question: QuestionSlideData[] = this.slides.filter(slide => slide.type === "question")

        const lesson: LessonData = {
            id: lessonId,
            name: this.lessonName,
            groupname: this.groupName,
            intro,
            question,
            isLessonNew
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

    private audioFilesUpdatedHandler(state: AudioFilesUpdated) {
        const newAudioFile = state.audioFile
        this.audioFiles = [...this.audioFiles, newAudioFile]
    }

    private async audioFileDeletedHandler(state: AudioFileDeleted) {

        const deletedFileName = state.name

        const userResponse = await this.messageDialog.getUserResponse({ text: `Delete this recording: ${deletedFileName} ?`, link: undefined })

        if (userResponse.response === "Yes") {
            this.audioFiles = this.audioFiles.filter(audioFile => audioFile.name !== deletedFileName)
            this.slides = this.slides.map(slide => {
                if (slide.soundurl === deletedFileName) return { ...slide, soundurl: "" }
                return { ...slide }
            })
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

const createMockAudioFiles = (slides: (QuestionSlideData | IntroSlideData)[]) => {

    const slidesWithAudio = slides.filter(slide => slide.soundurl)

    if (!slidesWithAudio.length) return []

    const soundUrls = slidesWithAudio.map(slide => slide.soundurl)

    return soundUrls.map(soundUrl => new File(["blah blah"], soundUrl))
}
