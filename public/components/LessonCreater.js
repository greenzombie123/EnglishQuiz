import "./FieldSet.js";
import "./GroupNameSelector.js";
import "./audio/AudioInput.js";
import { lesssonCreaterStore } from "./store/LessonCreaterStore.js";
class LessonCreater extends HTMLElement {
    root;
    slideIndex = 0;
    lessonId = null;
    store;
    form;
    static observedAttributes = ["data-lessonid"];
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "closed" });
        const template = document.getElementById("lesson-creater");
        this.root.appendChild(template.content.cloneNode(true));
        const selecterButton = this.root.getElementById("slide-selecterButton");
        this.form = this.root.querySelector("form");
        selecterButton.addEventListener("click", this.handleSelecterButtonClicked);
        this.form.addEventListener("submit", this.#handleCreateLesson);
        this.store = lesssonCreaterStore;
        // Subscribe to store events
        this.store.subscribe("audioFilesChanged", this.#handleAddSoundSelect);
        this.store.subscribe("audioFilesChanged", this.#handleUpdateSoundSelect);
    }
    connectedCallback() { }
    async attributeChangedCallback(name, oldValue, newValue) {
        if (name === "data-lessonid" && newValue) {
            this.lessonId = newValue;
            const lesson = await this.#getLessonSlides(this.lessonId);
            this.#fillFieldSets(lesson);
            //TODO Check to see if there are any audio files when receieve response from server
            return;
        }
        console.log("nothing!");
    }
    changeSlideIndex = (index) => {
        this.slideIndex += index;
    };
    // Create and add a specified fieldset with move and delete buttons added when appropriate
    handleSelecterButtonClicked = (e) => {
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
    getSlideValue = () => {
        const select = this.root.getElementById("slideSelecter");
        return select.value;
    };
    // Place new fieldset just before the slide selecter
    insertNewFieldSet = (fieldSet) => {
        const slideSelecter = this.root.querySelector(".slideSelecter");
        slideSelecter.before(fieldSet);
    };
    createFieldSet = (index, fieldSetType, slideData) => {
        const fieldSet = document.createElement("div");
        if (fieldSetType === "intro") {
            fieldSet.className = "slide-fieldSet";
            fieldSet.innerHTML = `
            <fieldset>
            <legend>Introduction</legend>
            <label>Enter the target word
                <input type="text" name="intro[${index}][targetword]" required ${slideData?.type === "intro"
                ? "value=" + slideData.targetword
                : ""} />
            </label>
            <label>Enter definition of target word
                <input type="text" name="intro[${index}][definition]" required ${slideData?.type === "intro"
                ? "value=" + slideData.definition
                : ""} />
            </label>
            <input type="hidden" name="intro[${index}][slideorder]" id="slideOrderInput" ${slideData?.type === "intro" ? "value=" + slideData.slideorder : ""} />
            ${this.#attachSoundSelectToFieldSet(slideData?.soundurl, "intro", index)}
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
                <input type="text" name="question[${index}][question]" required ${slideData?.type === "question"
                ? "value=" + slideData.question
                : ""} />
            </label>
            <label>Enter the correct answer
                <input type="text" name="question[${index}][correctanswer]" required  ${slideData?.type === "question"
                ? "value=" + slideData.correctanswer
                : ""} />
            </label>
            <label>Enter the wrong answer
                <input type="text" name="question[${index}][wronganswer1]" required ${slideData?.type === "question"
                ? "value=" + slideData.wronganswer1
                : ""} />
            </label>
            <label>Enter the wrong answer (Optional)
                <input type="text" name="question[${index}][wronganswer2]" ${slideData?.type === "question" && slideData.wronganswer2
                ? "value=" + slideData.wronganswer2
                : ""} />
            </label>
            <label>Enter the wrong answer (Optional)
                <input type="text" name="question[${index}][wronganswer3]" ${slideData?.type === "question" && slideData.wronganswer3
                ? "value=" + slideData.wronganswer3
                : ""} />
            </label>
            <input type="hidden" name="question[${index}][slideorder]" id="slideOrderInput" ${slideData?.type === "question"
                ? "value=" + slideData.slideorder
                : ""} />
            ${this.#attachSoundSelectToFieldSet(slideData?.soundurl, "question", index)}
        </fieldset>
        <div class="fieldSetButtons">
            <button class="deleteFieldSet" type="button">X</button>
        </div>
        `;
            return fieldSet;
        }
    };
    handleAddMoveButtons = () => {
        const fieldSetButtons = this.getAllFieldSetButtons();
        this.resetMoveButtons(fieldSetButtons);
        this.attachMoveButtons(fieldSetButtons);
        // Adjust slide order for slides
        this.handleSlideOrderAdjustment();
    };
    // get all the fieldSetButtons divs from the fieldsets
    getAllFieldSetButtons = () => {
        return Array.from(this.root.querySelectorAll(".fieldSetButtons"));
    };
    // Attach move buttons based on fieldset positioning
    attachMoveButtons = (fieldButtonContainers) => {
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
    createMoveButton = (buttonType) => {
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
    appendMoveButtons = (fieldSetButtons, moveButtons) => {
        moveButtons.forEach((moveButton) => {
            fieldSetButtons.appendChild(moveButton);
        });
    };
    resetMoveButtons = (fieldSetButtonsContainers) => {
        fieldSetButtonsContainers.forEach((fieldSetButtons) => {
            fieldSetButtons.querySelector(".up")?.remove();
            fieldSetButtons.querySelector(".down")?.remove();
        });
    };
    handleAttachDeleteFieldSetHandler = (fieldSet) => {
        const deleteFieldSetButton = fieldSet.querySelector(".deleteFieldSet");
        deleteFieldSetButton.addEventListener("click", this.deleteFieldSet);
    };
    // Delete a fieldset and rearrange move buttons
    deleteFieldSet = (e) => {
        const button = e.currentTarget;
        const fieldSet = button.closest(".slide-fieldSet");
        fieldSet?.remove();
        // Remove and add new appropriate move buttons
        this.handleAddMoveButtons();
        // Adjust slide order for slides
        this.handleSlideOrderAdjustment();
    };
    // Switch the placement of field sets
    handleMoveFieldSet = (e) => {
        const button = e.currentTarget;
        const value = button.className;
        if (value === "up") {
            const currentFieldSet = button.closest(".slide-fieldSet");
            const previousFieldSet = currentFieldSet?.previousElementSibling;
            previousFieldSet.before(currentFieldSet);
        }
        else if (value === "down") {
            const currentFieldSet = button.closest(".slide-fieldSet");
            const nextFieldSet = currentFieldSet?.nextElementSibling;
            currentFieldSet.before(nextFieldSet);
        }
        // Remove and add new appropriate move buttons
        this.handleAddMoveButtons();
    };
    handleSlideOrderAdjustment = () => {
        const inputs = this.getAllSlideOrderInputs();
        this.adjustSlideOrderInputs(inputs);
    };
    getAllSlideOrderInputs = () => {
        return Array.from(this.root.querySelectorAll("#slideOrderInput"));
    };
    adjustSlideOrderInputs = (inputs) => {
        inputs.forEach((input, index) => {
            input.value = `${index + 1}`;
        });
    };
    #getLessonSlides = async (lessonId) => {
        const response = await fetch(`/lessons/get/${lessonId}`);
        return response.json();
    };
    #fillFieldSets = ({ name, groupname, slides }) => {
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
    };
    // Sound Select Functionality
    #handleAddSoundSelect = () => {
        const audioFiles = this.store.getState("audioFiles");
        // Check if there are any audio files and no sound selects
        const soundSelects = Array.from(this.root.querySelectorAll(".sound_select"));
        if (audioFiles.length)
            soundSelects.forEach((soundSelect) => (soundSelect.style.display = "block"));
        else
            soundSelects.forEach((soundSelect) => (soundSelect.style.display = "hidden"));
    };
    #createSoundSelect() {
        const select = document.createElement("select");
        select.classList.add("sound_select");
        select.name = "soundurl";
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "--- No Sound File is Chosen";
        //TODO Might need to change once we can recieve audio files from server
        option.selected = true;
        select.appendChild(option);
        const audioFiles = this.store.getState("audioFiles");
        audioFiles.forEach((audioFile) => {
            const option = document.createElement("option");
            option.value = audioFile.name;
            option.textContent = audioFile.name;
            select.appendChild(option);
        });
        return select;
    }
    #attachSoundSelectToFieldSet(soundurl, type, index) {
        const audioFiles = this.store.getState("audioFiles");
        const options = audioFiles.map((audioFile) => {
            return `<option value=${audioFile.name} ${soundurl === audioFile.name ? "selected" : ""}>${audioFile.name}</option>`;
        });
        const isOptionSelected = audioFiles.some((audioFile) => audioFile.name === soundurl);
        return `<select class="sound_select" name="${type}[${index}][soundurl]"} value=${isOptionSelected ? soundurl : ""} ${isOptionSelected ? 'style="display:block"' : 'style="display:none"'} >
      <option value="" selected>--- No Sound File Chosen</option>
      ${options.join("")}
    </select>`;
    }
    #handleUpdateSoundSelect = () => {
        const audioFiles = this.store.getState("audioFiles");
        const soundSelects = Array.from(this.root.querySelectorAll(".sound_select"));
        soundSelects.forEach((soundSelect) => {
            const currentSoundFile = soundSelect.value;
            while (soundSelect.firstChild) {
                soundSelect.removeChild(soundSelect.firstChild);
            }
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "--- No Sound File is Chosen";
            const hasSelectedFile = audioFiles.some((audioFile) => soundSelect.value === audioFile.name);
            if (!hasSelectedFile) {
                soundSelect.value = "";
                defaultOption.selected = true;
            }
            soundSelect.appendChild(defaultOption);
            audioFiles.forEach((audioFile) => {
                const option = document.createElement("option");
                option.value = audioFile.name;
                option.textContent = audioFile.name;
                soundSelect.appendChild(option);
                if (option.value === currentSoundFile)
                    option.selected = true;
            });
        });
    };
    #handleCreateLesson = async (e) => {
        e.preventDefault();
        const formdata = new FormData(this.form);
        const audioFiles = this.store.getState("audioFiles");
        const audioFileNames = this.#getChosenSoundFiles();
        const response = await fetch("/lessons/createlesson", {
            method: "POST",
            body: formdata,
        });
        const presignedUrls = await response.json();
        console.log(presignedUrls);
        const promises = presignedUrls.map((presignedUrl) => {
            const isMatch = audioFiles.find((audioFile) => audioFile.name === presignedUrl.key);
            console.log(isMatch);
            if (isMatch) {
                return fetch(presignedUrl.url, {
                    method: "PUT",
                    body: isMatch,
                });
            }
        });
        console.log(promises);
        const results = await Promise.all(promises);
        console.log(results);
    };
    #getChosenSoundFiles = () => {
        const soundSelects = Array.from(this.root.querySelectorAll(".sound_select"));
        let values = soundSelects.map((soundSelect) => soundSelect.value);
        values = values.filter((value) => (value ? true : false));
        return values;
    };
    disconnectedCallback() { }
    connectedMoveCallback() { }
}
customElements.define("lesson-creater", LessonCreater);
