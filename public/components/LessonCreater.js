var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LessonCreater_instances, _LessonCreater_getLessonSlides, _LessonCreater_fillFieldSets, _LessonCreater_createSoundSelect, _LessonCreater_hasSoundSelects, _LessonCreater_attachSoundSelectToFieldSet;
import "./FieldSet.js";
import "./GroupNameSelector.js";
import "./audio/AudioInput.js";
import { lesssonCreaterStore } from "./store/LessonCreaterStore.js";
class LessonCreater extends HTMLElement {
    constructor() {
        super();
        _LessonCreater_instances.add(this);
        this.slideIndex = 0;
        this.lessonId = null;
        this.changeSlideIndex = (index) => {
            this.slideIndex += index;
        };
        // Create and add a specified fieldset with move and delete buttons added when appropriate
        this.handleSelecterButtonClicked = (e) => {
            // Search for node with the specified css selecter by tranversing the element and its parents
            const isSelecterButton = e.currentTarget.closest("#slide-selecterButton");
            if (!isSelecterButton)
                return;
            const slideValue = this.getSlideValue();
            if (!slideValue)
                return;
            this.changeSlideIndex(1);
            const fieldSet = this.createFieldSet(this.slideIndex, slideValue);
            this.insertNewFieldSet(fieldSet);
            this.handleAttachDeleteFieldSetHandler(fieldSet);
            this.handleAddMoveButtons();
        };
        // Get value from the select in the slide selecter
        this.getSlideValue = () => {
            const select = this.root.getElementById("slideSelecter");
            return select.value;
        };
        // Place new fieldset just before the slide selecter
        this.insertNewFieldSet = (fieldSet) => {
            const slideSelecter = this.root.querySelector(".slideSelecter");
            slideSelecter.before(fieldSet);
        };
        //TODO Add sound selecter later
        this.createFieldSet = (index, fieldSetType, slideData) => {
            const fieldSet = document.createElement("div");
            if (fieldSetType === "intro") {
                fieldSet.className = "slide-fieldSet";
                fieldSet.innerHTML = `
            <fieldset>
            <legend>Introduction</legend>
            <label>Enter the target word
                <input type="text" name="intro[${index}][targetword]" required ${(slideData === null || slideData === void 0 ? void 0 : slideData.type) === "intro"
                    ? "value=" + slideData.targetword
                    : ""} />
            </label>
            <label>Enter definition of target word
                <input type="text" name="intro[${index}][definition]" required ${(slideData === null || slideData === void 0 ? void 0 : slideData.type) === "intro"
                    ? "value=" + slideData.definition
                    : ""} />
            </label>
            <input type="hidden" name="intro[${index}][slideorder]" id="slideOrderInput" ${(slideData === null || slideData === void 0 ? void 0 : slideData.type) === "intro" ? "value=" + slideData.slideorder : ""} />
            ${this.store.getState("audioFiles").length !== 0 ? __classPrivateFieldGet(this, _LessonCreater_instances, "m", _LessonCreater_attachSoundSelectToFieldSet).call(this) : ""}
        </fieldset>
        <div class="fieldSetButtons">
            <button class="deleteFieldSet" type="button">X</button>
        </div>
        `;
                return fieldSet;
            }
            else {
                fieldSet.className = "slide-fieldSet";
                fieldSet.innerHTML = `
             <fieldset class="question">
            <legend>Question</legend>
            <label>Enter question
                <input type="text" name="question[${index}][question]" required ${(slideData === null || slideData === void 0 ? void 0 : slideData.type) === "question"
                    ? "value=" + slideData.question
                    : ""} />
            </label>
            <label>Enter the correct answer
                <input type="text" name="question[${index}][correctanswer]" required  ${(slideData === null || slideData === void 0 ? void 0 : slideData.type) === "question"
                    ? "value=" + slideData.correctanswer
                    : ""} />
            </label>
            <label>Enter the wrong answer
                <input type="text" name="question[${index}][wronganswer1]" required ${(slideData === null || slideData === void 0 ? void 0 : slideData.type) === "question"
                    ? "value=" + slideData.wronganswer1
                    : ""} />
            </label>
            <label>Enter the wrong answer (Optional)
                <input type="text" name="question[${index}][wronganswer2]" ${(slideData === null || slideData === void 0 ? void 0 : slideData.type) === "question" && slideData.wronganswer2
                    ? "value=" + slideData.wronganswer2
                    : ""} />
            </label>
            <label>Enter the wrong answer (Optional)
                <input type="text" name="question[${index}][wronganswer3]" ${(slideData === null || slideData === void 0 ? void 0 : slideData.type) === "question" && slideData.wronganswer3
                    ? "value=" + slideData.wronganswer3
                    : ""} />
            </label>
            <input type="hidden" name="question[${index}][slideorder]" id="slideOrderInput" ${(slideData === null || slideData === void 0 ? void 0 : slideData.type) === "question"
                    ? "value=" + slideData.slideorder
                    : ""} />
            ${this.store.getState("audioFiles").length !== 0 ? __classPrivateFieldGet(this, _LessonCreater_instances, "m", _LessonCreater_attachSoundSelectToFieldSet).call(this) : ""}
        </fieldset>
        <div class="fieldSetButtons">
            <button class="deleteFieldSet" type="button">X</button>
        </div>
        `;
                return fieldSet;
            }
        };
        this.handleAddMoveButtons = () => {
            const fieldSetButtons = this.getAllFieldSetButtons();
            this.resetMoveButtons(fieldSetButtons);
            this.attachMoveButtons(fieldSetButtons);
            // Adjust slide order for slides
            this.handleSlideOrderAdjustment();
        };
        // get all the fieldSetButtons divs from the fieldsets
        this.getAllFieldSetButtons = () => {
            return Array.from(this.root.querySelectorAll(".fieldSetButtons"));
        };
        // Attach move buttons based on fieldset positioning
        this.attachMoveButtons = (fieldButtonContainers) => {
            const numOfFieldSets = fieldButtonContainers.length;
            fieldButtonContainers.forEach((fieldButtons, index) => {
                if (numOfFieldSets === 1)
                    return;
                else if (index === 0) {
                    const downButton = this.createMoveButton("down");
                    this.appendMoveButtons(fieldButtons, [downButton]);
                }
                else if (index === numOfFieldSets - 1) {
                    const upButton = this.createMoveButton("up");
                    this.appendMoveButtons(fieldButtons, [upButton]);
                }
                else {
                    const upButton = this.createMoveButton("up");
                    const downButton = this.createMoveButton("down");
                    this.appendMoveButtons(fieldButtons, [upButton, downButton]);
                }
            });
        };
        this.createMoveButton = (buttonType) => {
            const button = document.createElement("button");
            button.className = buttonType;
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", "30px");
            svg.setAttribute("height", "30px");
            svg.setAttribute("viewBox", "0 0 15 15");
            svg.setAttribute("fill", "none");
            button.appendChild(svg);
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", `${buttonType === "up" ? "M7.5 3L15 11H0L7.5 3Z" : "M7.49988 12L-0.00012207 4L14.9999 4L7.49988 12Z"}`);
            path.setAttribute("fill", "#000000");
            svg.appendChild(path);
            button.type = "button";
            button.addEventListener("click", this.handleMoveFieldSet);
            return button;
        };
        this.appendMoveButtons = (fieldSetButtons, moveButtons) => {
            moveButtons.forEach((moveButton) => {
                fieldSetButtons.appendChild(moveButton);
            });
        };
        this.resetMoveButtons = (fieldSetButtonsContainers) => {
            fieldSetButtonsContainers.forEach((fieldSetButtons) => {
                var _a, _b;
                (_a = fieldSetButtons.querySelector(".up")) === null || _a === void 0 ? void 0 : _a.remove();
                (_b = fieldSetButtons.querySelector(".down")) === null || _b === void 0 ? void 0 : _b.remove();
            });
        };
        this.handleAttachDeleteFieldSetHandler = (fieldSet) => {
            const deleteFieldSetButton = fieldSet.querySelector(".deleteFieldSet");
            deleteFieldSetButton.addEventListener("click", this.deleteFieldSet);
        };
        // Delete a fieldset and rearrange move buttons
        this.deleteFieldSet = (e) => {
            const button = e.currentTarget;
            const fieldSet = button.closest(".slide-fieldSet");
            fieldSet === null || fieldSet === void 0 ? void 0 : fieldSet.remove();
            // Remove and add new appropriate move buttons
            this.handleAddMoveButtons();
            // Adjust slide order for slides
            this.handleSlideOrderAdjustment();
        };
        // Switch the placement of field sets
        this.handleMoveFieldSet = (e) => {
            const button = e.currentTarget;
            const value = button.className;
            if (value === "up") {
                const currentFieldSet = button.closest(".slide-fieldSet");
                const previousFieldSet = currentFieldSet === null || currentFieldSet === void 0 ? void 0 : currentFieldSet.previousElementSibling;
                previousFieldSet.before(currentFieldSet);
            }
            else if (value === "down") {
                const currentFieldSet = button.closest(".slide-fieldSet");
                const nextFieldSet = currentFieldSet === null || currentFieldSet === void 0 ? void 0 : currentFieldSet.nextElementSibling;
                currentFieldSet.before(nextFieldSet);
            }
            // Remove and add new appropriate move buttons
            this.handleAddMoveButtons();
        };
        this.handleSlideOrderAdjustment = () => {
            const inputs = this.getAllSlideOrderInputs();
            this.adjustSlideOrderInputs(inputs);
        };
        this.getAllSlideOrderInputs = () => {
            return Array.from(this.root.querySelectorAll("#slideOrderInput"));
        };
        this.adjustSlideOrderInputs = (inputs) => {
            inputs.forEach((input, index) => {
                input.value = `${index + 1}`;
            });
        };
        _LessonCreater_getLessonSlides.set(this, async (lessonId) => {
            const response = await fetch(`/lessons/get/${lessonId}`);
            return response.json();
        });
        _LessonCreater_fillFieldSets.set(this, ({ name, groupname, slides }) => {
            const nameInput = this.root.getElementById("lessonName");
            const groupNameInput = this.root.querySelector("groupname-selecter");
            nameInput.value = name;
            groupNameInput.setGroupName(groupname || "");
            slides.forEach((slide) => {
                this.changeSlideIndex(1);
                const fieldSet = this.createFieldSet(this.slideIndex, slide.type, slide);
                this.insertNewFieldSet(fieldSet);
                this.handleAttachDeleteFieldSetHandler(fieldSet);
            });
            this.handleAddMoveButtons();
        });
        this.handleSoundFilesChange = () => {
            const audioFiles = this.store.getState("audioFiles");
            // Check if there are any audio files and no sound selects
            if (!__classPrivateFieldGet(this, _LessonCreater_instances, "m", _LessonCreater_hasSoundSelects).call(this) && audioFiles.length) {
                const fieldsets = Array.from(this.root.querySelectorAll("fieldSet"));
                fieldsets.forEach((fieldset) => {
                    const soundselect = __classPrivateFieldGet(this, _LessonCreater_instances, "m", _LessonCreater_createSoundSelect).call(this);
                    fieldset.appendChild(soundselect);
                });
            }
        };
        this.root = this.attachShadow({ mode: "closed" });
        const template = document.getElementById("lesson-creater");
        this.root.appendChild(template.content.cloneNode(true));
        const selecterButton = this.root.getElementById("slide-selecterButton");
        selecterButton.addEventListener("click", this.handleSelecterButtonClicked);
        this.store = lesssonCreaterStore;
        // Subscribe to store events
        this.store.subscribe("audioFilesChanged", this.handleSoundFilesChange);
    }
    connectedCallback() { }
    async attributeChangedCallback(name, oldValue, newValue) {
        if (name === "data-lessonid" && newValue) {
            this.lessonId = newValue;
            const lesson = await __classPrivateFieldGet(this, _LessonCreater_getLessonSlides, "f").call(this, this.lessonId);
            __classPrivateFieldGet(this, _LessonCreater_fillFieldSets, "f").call(this, lesson);
            //TODO Check to see if there are any audio files
            return;
        }
        console.log("nothing!");
    }
    disconnectedCallback() { }
    connectedMoveCallback() { }
}
_LessonCreater_getLessonSlides = new WeakMap(), _LessonCreater_fillFieldSets = new WeakMap(), _LessonCreater_instances = new WeakSet(), _LessonCreater_createSoundSelect = function _LessonCreater_createSoundSelect() {
    const select = document.createElement("select");
    select.classList.add("sound_select");
    select.name = "soundurl";
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "--- Select a sound file";
    select.appendChild(option);
    const audioFiles = this.store.getState("audioFiles");
    audioFiles.forEach((audioFile) => {
        const option = document.createElement("option");
        option.value = audioFile.name;
        option.textContent = audioFile.name.slice(0, -4);
        select.appendChild(option);
    });
    return select;
}, _LessonCreater_hasSoundSelects = function _LessonCreater_hasSoundSelects() {
    return this.root.querySelectorAll(".sound_select").length !== 0;
}, _LessonCreater_attachSoundSelectToFieldSet = function _LessonCreater_attachSoundSelectToFieldSet() {
    const audioFiles = this.store.getState("audioFiles");
    const options = audioFiles.map((audioFile) => {
        return `<option value=${audioFile.name}>${audioFile.name.slice(0, -4)}</option>`;
    });
    return `<select class="sound_select" name="soundurl">
      <option value="">--- Select a sound file</option>
      ${options.join("")}
    </select>`;
};
LessonCreater.observedAttributes = ["data-lessonid"];
customElements.define("lesson-creater", LessonCreater);
//# sourceMappingURL=LessonCreater.js.map