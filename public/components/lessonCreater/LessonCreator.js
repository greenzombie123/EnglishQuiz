var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import "./NameContainer.js";
import "./GroupNameSelector.js";
import "./SlideSelector.js";
import "./SoundSelector.js";
import "./SlideFieldSet.js";
import "../MessageDialog.js";
import "../audio/AudioInput.js";
const j = { slidetype: "intro", definition: "f", targetword: "f", slideorder: 1, soundurl: "f" };
const files = [new File(["fefe"], "wow.com"), new File(["ddef"], "hot.webm")];
let LessonCreator = class LessonCreator extends LitElement {
    constructor() {
        super(...arguments);
        this.lessonName = "";
        this.groupName = "";
        this.groupNameList = [];
        this.slides = [];
        this.slideCount = 0;
        this.audioFiles = [];
    }
    static { this.styles = css `
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
`; }
    render() {
        return html `
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
            ${map(this.slides, (slide, index) => html `<slide-fieldset moveButtonState=${this.setMoveButtonState(index, this.slides.length)} .slide=${slide} .soundUrls=${this.audioFiles.map(audioFile => audioFile.name)}></slide-fieldset>`)}

            <slide-selector></slide-selector>

            <button type="button" class="submit" @click=${this.sendLesson}>${!this.lessonId ? "Create Lesson" : "Finish editing lesson"}</button>

            <message-dialog .url=${"/lessons"} .message=${"The lesson was successfully created."} .linkText=${"Return to Dashboard"}></message-dialog>
        </form>
    `;
    }
    async firstUpdated(_changedProperties) {
        if (this.lessonId) {
            await this.getLesson(this.lessonId);
        }
        await this.getGroupNames();
    }
    async getAudioFiles(lessonId) {
        const response = await fetch(`/lessons/audiofiles/${lessonId}`);
        const audioItems = await response.json();
        return await Promise.all(audioItems.map(async (audioItem) => {
            const response = await fetch(audioItem.url);
            const blob = await response.blob();
            const file = new File([blob], audioItem.fileName);
            return file;
        }));
    }
    async sendAudioFiles(audioItems, audioFiles) {
        if (!audioFiles.length)
            return;
        const audioItemMap = new Map();
        audioItems.forEach(audioItem => {
            audioItemMap.set(audioItem.fileName, audioItem.url);
        });
        const fileAndUrls = [];
        audioFiles.forEach(audioFile => {
            const url = audioItemMap.get(audioFile.name);
            if (url) {
                const file = audioFile;
                const fileAndUrl = { url, file };
                fileAndUrls.push(fileAndUrl);
            }
        });
        await Promise.all(fileAndUrls.map(async (fileAndUrl) => {
            await fetch(fileAndUrl.url, {
                method: "PUT",
                body: fileAndUrl.file
            });
        }));
    }
    async createPresignedUrls(audioFiles, lessonId, slides) {
        const soundUrls = new Set(slides.map(slide => slide.soundurl));
        const soundUrlsToSend = [];
        audioFiles.forEach(audioFile => {
            if (soundUrls.has(audioFile.name))
                soundUrlsToSend.push(audioFile.name);
            console.log(audioFiles.map(g => g.name), slides.map(slide => slide.soundurl));
        });
        if (!soundUrlsToSend.length)
            return [];
        const response = await fetch("/lessons/audiofiles", {
            method: "POST",
            body: JSON.stringify({ fileNames: soundUrlsToSend, lessonId }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const audioItems = await response.json();
        return audioItems;
    }
    async getLesson(lessonId) {
        const response = await fetch(`/lessons/get/${lessonId}`);
        if (!response.ok)
            return;
        const lesson = await response.json();
        this.lessonName = lesson.name;
        this.groupName = lesson.groupname;
        this.slideCount = lesson.slides.length;
        this.slides = [...lesson.slides];
        const soundUrls = this.slides.map(slide => slide.soundurl);
        if (soundUrls.length) {
            this.audioFiles = await this.getAudioFiles(lessonId);
        }
    }
    async sendLesson() {
        //TODO Add feature that tells user that they must create at least one slide before creating lesson
        if (this.slides.length === 0)
            return;
        //TODO Check if there lessonId. Also, flag if lesson is new
        let lessonId;
        let isLessonNew;
        // lesson is not new if its a 0
        if (this.lessonId) {
            lessonId = this.lessonId;
            isLessonNew = false;
        }
        else {
            lessonId = await this.makeLesson(this.lessonName, this.groupName);
            isLessonNew = true;
        }
        const audioItems = await this.createPresignedUrls(this.audioFiles, lessonId, this.slides);
        if (audioItems.length)
            await this.sendAudioFiles(audioItems, this.audioFiles);
        const lesson = this.createLesson(lessonId, isLessonNew);
        const response = await fetch("/lessons/createlesson", {
            method: "POST",
            body: JSON.stringify(lesson),
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(response.statusText);
        if (!response.ok)
            return;
        this.messageDialog.open({
            text: `${this.lessonId ? "Your lesson has successfully updated." : "The lesson was created."}`,
            link: "/lessons",
            buttonText: "Return to the dashboard"
        });
    }
    async makeLesson(name, groupname) {
        const response = await fetch("/lessons/createjustlesson", {
            method: "POST",
            body: JSON.stringify({ name, groupname }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const lessonId = await response.json();
        return lessonId;
    }
    async getGroupNames() {
        const response = await fetch(`/lessons/groupnames`);
        if (!response.ok)
            return;
        const groupnames = await response.json();
        this.groupNameList = [...groupnames];
    }
    createLesson(lessonId, isLessonNew) {
        const intro = this.slides.filter(slide => slide.type === "intro");
        const question = this.slides.filter(slide => slide.type === "question");
        const lesson = {
            id: lessonId,
            name: this.lessonName,
            groupname: this.groupName,
            intro,
            question,
            isLessonNew
        };
        return lesson;
    }
    setMoveButtonState(slideIndex, maxSlides) {
        slideIndex++;
        if (maxSlides === 1)
            return "none";
        if (slideIndex === 1)
            return "down";
        if (slideIndex === maxSlides)
            return "up";
        else
            return "both";
    }
    slideOrderChangedHandler(state) {
        const slides = [...this.slides];
        const { oldSlideOrder: o, newSlideOrder: n } = state;
        const newSlides = slides.map(slide => {
            if (slide.slideorder === o) {
                return { ...slide, slideorder: n };
            }
            else if (slide.slideorder === n) {
                return { ...slide, slideorder: o };
            }
            else
                return slide;
        });
        newSlides.sort((a, b) => a.slideorder - b.slideorder);
        this.slides = [...newSlides];
    }
    lessonDataChangedHandler(state) {
        if (state.field === "lessonName")
            this.lessonName = state.value;
        else if (state.field === "groupName")
            this.groupName = state.value;
    }
    slideAddedHandler(state) {
        const slideType = state.value;
        this.slideCount = this.slideCount + 1;
        if (slideType === "intro") {
            const slide = {
                type: "intro",
                slideorder: this.slideCount,
                targetword: "",
                definition: "",
                soundurl: ""
            };
            this.slides = [...this.slides, slide];
        }
        else if (slideType === "question") {
            const slide = {
                type: "question",
                slideorder: this.slideCount,
                question: "",
                correctanswer: "",
                wronganswer1: "",
                wronganswer2: "",
                wronganswer3: "",
                soundurl: ""
            };
            this.slides = [...this.slides, slide];
        }
    }
    slideChangedHandler(state) {
        const slides = [...this.slides];
        const newSlides = slides.map(slide => {
            if (slide.slideorder === state.slideOrder) {
                return {
                    ...slide, [state.field]: state.value
                };
            }
            else
                return slide;
        });
        this.slides = [...newSlides];
    }
    slideDeletedHandler(state) {
        const { slideorder } = state;
        const newSlides = this.slides
            .filter(slide => slide.slideorder !== slideorder)
            .map((slide, index) => { return { ...slide, slideorder: index + 1 }; });
        this.slides = [...newSlides];
    }
    audioFilesUpdatedHandler(state) {
        const newAudioFile = state.audioFile;
        this.audioFiles = [...this.audioFiles, newAudioFile];
    }
    async audioFileDeletedHandler(state) {
        const deletedFileName = state.name;
        const userResponse = await this.messageDialog.getUserResponse({ text: `Delete this recording: ${deletedFileName} ?`, link: undefined });
        if (userResponse.response === "Yes")
            this.audioFiles = this.audioFiles.filter(audioFile => audioFile.name !== deletedFileName);
    }
    stateChangedHandler(e) {
        const newState = e.detail;
        switch (newState.action) {
            case "lessonDataChanged":
                this.lessonDataChangedHandler(newState);
                break;
            case "slideChanged":
                this.slideChangedHandler(newState);
                break;
            case "slideAdded":
                this.slideAddedHandler(newState);
                break;
            case "slideOrderChanged":
                this.slideOrderChangedHandler(newState);
                break;
            case "slideDeleted":
                this.slideDeletedHandler(newState);
                break;
            case "audioFilesUpdated":
                this.audioFilesUpdatedHandler(newState);
                break;
            case "audioFileDeleted":
                this.audioFileDeletedHandler(newState);
                break;
            default:
                break;
        }
    }
};
__decorate([
    property({ type: Number })
], LessonCreator.prototype, "lessonId", void 0);
__decorate([
    state()
], LessonCreator.prototype, "lessonName", void 0);
__decorate([
    state()
], LessonCreator.prototype, "groupName", void 0);
__decorate([
    state()
], LessonCreator.prototype, "groupNameList", void 0);
__decorate([
    state()
], LessonCreator.prototype, "slides", void 0);
__decorate([
    state()
], LessonCreator.prototype, "slideCount", void 0);
__decorate([
    state()
], LessonCreator.prototype, "audioFiles", void 0);
__decorate([
    query("message-dialog")
], LessonCreator.prototype, "messageDialog", void 0);
LessonCreator = __decorate([
    customElement("lesson-creator")
], LessonCreator);
export { LessonCreator };
const createMockAudioFiles = (slides) => {
    const slidesWithAudio = slides.filter(slide => slide.soundurl);
    if (!slidesWithAudio.length)
        return [];
    const soundUrls = slidesWithAudio.map(slide => slide.soundurl);
    return soundUrls.map(soundUrl => new File(["blah blah"], soundUrl));
};
//# sourceMappingURL=LessonCreator.js.map