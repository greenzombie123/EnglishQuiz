import "./FieldSet.js";
class LessonCreater extends HTMLElement {
    constructor() {
        super();
        // Get the value from the select element
        this.handleSelecterButtonClicked = (e) => {
            // Search for node with the specified css selecter by tranversing the element and its parents
            const isSelecterButton = e.currentTarget.closest("#slide-selecterButton");
            if (!isSelecterButton)
                return;
            const slideValue = this.getSlideValue();
            if (!slideValue)
                return;
            const fieldSet = this.createFieldSet(slideValue);
            this.insertNewFieldSet(fieldSet);
        };
        // Get value from the select in the slide selecter
        this.getSlideValue = () => {
            const select = this.root.getElementById("slideSelecter");
            return select.value;
        };
        this.createFieldSet = (slideValue) => {
            if (slideValue === "intro") {
                return document.createElement("intro-fieldset");
            }
            else {
                return document.createElement("question-fieldset");
            }
        };
        // Place new fieldset just before the slide selecter
        this.insertNewFieldSet = (fieldSet) => {
            const slideSelecter = this.root.querySelector(".slideSelecter");
            slideSelecter.before(fieldSet);
        };
        this.connectedCallback = () => { };
        this.disconnectedCallback = () => { };
        this.connectedMoveCallback = () => { };
        this.root = this.attachShadow({ mode: "closed" });
        const template = document.getElementById("lesson-creater");
        this.root.appendChild(template.content.cloneNode(true));
        const selecterButton = this.root.getElementById("slide-selecterButton");
        selecterButton.addEventListener("click", this.handleSelecterButtonClicked);
    }
}
customElements.define("lesson-creater", LessonCreater);
//# sourceMappingURL=LessonCreater.js.map