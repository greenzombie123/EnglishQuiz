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
                fieldSet.className = "intro-FieldSet";
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
        <button class="deleteFieldSet">X</button>
        `;
                return fieldSet;
            }
            else {
                fieldSet.className = "question-FieldSet";
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
        <button class="deleteFieldSet">X</button>
        `;
                return fieldSet;
            }
            ;
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