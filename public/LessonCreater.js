import "./FieldSet.js";
class LessonCreater extends HTMLElement {
    constructor() {
        super();
        this.slideIndex = 0;
        this.changeSlideIndex = (index) => {
            this.slideIndex += index;
        };
        // Get the value from the select element
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
        this.createFieldSet = (index, fieldSetType) => {
            const fieldSet = document.createElement("div");
            if (fieldSetType === "intro") {
                fieldSet.className = "slide-fieldSet";
                fieldSet.innerHTML = `
            <fieldset>
            <legend>Introduction</legend>
            <label>Enter the target word
                <input type="text" name="intro[${index}][targetword]" required />
            </label>
            <label>Enter definition of target word
                <input type="text" name="intro[${index}][definition]" required />
            </label>
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
                <input type="text" name="question[${index}][question]" required />
            </label>
            <label>Enter the correct answer
                <input type="text" name="question[${index}][correntanswer]" required />
            </label>
            <label>Enter the wrong answer
                <input type="text" name="question[${index}][wronganswer1]" required />
            </label>
            <label>Enter the wrong answer
                <input type="text" name="question[${index}][wronganswer2]" required />
            </label>
            <label>Enter the wrong answer
                <input type="text" name="question[${index}][wronganswer3]" required />
            </label>
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
                    this.attachMoveDownButton(fieldButtons);
                }
                else if (index === (numOfFieldSets - 1)) {
                    this.attachMoveUpButton(fieldButtons);
                }
                else {
                    this.attachMoveUpButton(fieldButtons);
                    this.attachMoveDownButton(fieldButtons);
                }
            });
        };
        this.attachMoveUpButton = (fieldSetButtons) => {
            const upButton = document.createElement("button");
            upButton.className = "up";
            upButton.textContent = "up";
            fieldSetButtons.appendChild(upButton);
        };
        this.attachMoveDownButton = (fieldSetButtons) => {
            const downButton = document.createElement("button");
            downButton.className = "down";
            downButton.textContent = "down";
            fieldSetButtons.appendChild(downButton);
        };
        this.resetMoveButtons = (fieldSetButtonsContainers) => {
            fieldSetButtonsContainers.forEach(fieldSetButtons => {
                var _a, _b;
                (_a = fieldSetButtons.querySelector(".up")) === null || _a === void 0 ? void 0 : _a.remove();
                (_b = fieldSetButtons.querySelector(".down")) === null || _b === void 0 ? void 0 : _b.remove();
            });
        };
        this.handleAttachDeleteFieldSetHandler = (fieldSet) => {
            const deleteFieldSetButton = fieldSet.querySelector('.deleteFieldSet');
            deleteFieldSetButton.addEventListener("click", this.deleteFieldSet);
        };
        this.deleteFieldSet = (e) => {
            const button = e.currentTarget;
            const fieldSet = button.closest(".slide-fieldSet");
            console.log(fieldSet);
        };
        this.connectedCallback = () => { };
        this.disconnectedCallback = () => { };
        this.connectedMoveCallback = () => { };
        this.root = this.attachShadow({ mode: "open" });
        const template = document.getElementById("lesson-creater");
        this.root.appendChild(template.content.cloneNode(true));
        const selecterButton = this.root.getElementById("slide-selecterButton");
        selecterButton.addEventListener("click", this.handleSelecterButtonClicked);
    }
}
customElements.define("lesson-creater", LessonCreater);
//# sourceMappingURL=LessonCreater.js.map