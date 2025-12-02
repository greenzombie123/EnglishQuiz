import "./FieldSet.ts";
import { IntroFieldSet, QuestionFieldSet } from "./FieldSet.ts";

class LessonCreater extends HTMLElement {
  root;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "closed" });
    const template = document.getElementById(
      "lesson-creater"
    ) as HTMLTemplateElement;

    this.root.appendChild(template.content.cloneNode(true));

    const selecterButton = this.root.getElementById(
      "slide-selecterButton"
    ) as HTMLButtonElement;

    selecterButton.addEventListener("click", this.handleSelecterButtonClicked);
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
    const fieldSet = this.createFieldSet(slideValue)
    this.insertNewFieldSet(fieldSet)
  };

  // Get value from the select in the slide selecter
  getSlideValue = () => {
    const select = this.root.getElementById(
      "slideSelecter"
    ) as HTMLSelectElement;
    return select.value;
  };

  createFieldSet = (slideValue: string) => {
    if (slideValue === "intro") {
      return document.createElement("intro-fieldset") as IntroFieldSet;
    } else {
      return document.createElement("question-fieldset") as QuestionFieldSet;
    }
  };

  // Place new fieldset just before the slide selecter
  insertNewFieldSet = (fieldSet: IntroFieldSet | QuestionFieldSet) => {
    const slideSelecter = this.root.querySelector(
      ".slideSelecter"
    ) as HTMLElement;
    slideSelecter.before(fieldSet);
  };

  connectedCallback = () => {};

  disconnectedCallback = () => {};

  connectedMoveCallback = () => {};
}

customElements.define("lesson-creater", LessonCreater);
