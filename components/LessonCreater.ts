import "./FieldSet.ts";
import { IntroFieldSet, QuestionFieldSet } from "./FieldSet.ts";

class LessonCreater extends HTMLElement {
    root;
    slideIndex = 0

    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        const template = document.getElementById(
            "lesson-creater"
        ) as HTMLTemplateElement;

        this.root.appendChild(template.content.cloneNode(true));

        const selecterButton = this.root.getElementById(
            "slide-selecterButton"
        ) as HTMLButtonElement;

        selecterButton.addEventListener("click", this.handleSelecterButtonClicked);
    }

    changeSlideIndex = (index:number)=>{
        this.slideIndex += index
    }

    // Get the value from the select element
    handleSelecterButtonClicked = (e: Event) => {
        // Search for node with the specified css selecter by tranversing the element and its parents
        const isSelecterButton = (e.currentTarget as HTMLButtonElement).closest(
            "#slide-selecterButton"
        );
        if (!isSelecterButton) return;
        const slideValue = this.getSlideValue();
        if (!slideValue) return;
        this.changeSlideIndex(1)
        const fieldSet = this.createFieldSet(this.slideIndex, slideValue);
        this.insertNewFieldSet(fieldSet);
    };

    // Get value from the select in the slide selecter
    getSlideValue = () => {
        const select = this.root.getElementById(
            "slideSelecter"
        ) as HTMLSelectElement;
        return select.value;
    };

    // Place new fieldset just before the slide selecter
    insertNewFieldSet = (fieldSet: HTMLElement) => {
        const slideSelecter = this.root.querySelector(
            ".slideSelecter"
        ) as HTMLElement;
        slideSelecter.before(fieldSet);
    };

    createFieldSet = (index: number, fieldSetType: string) => {
        const fieldSet = document.createElement("div") as HTMLDivElement
        if (fieldSetType === "intro") {
            fieldSet.className = "intro-FieldSet"
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
        `
            return fieldSet
        } else {
            fieldSet.className = "question-FieldSet"
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
        `
            return fieldSet
        };
    }
    connectedCallback = () => { };

    disconnectedCallback = () => { };

    connectedMoveCallback = () => { };
}

customElements.define("lesson-creater", LessonCreater);
