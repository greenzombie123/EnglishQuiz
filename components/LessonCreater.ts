import "./FieldSet.ts";
import { IntroFieldSet, QuestionFieldSet } from "./FieldSet.ts";

class LessonCreater extends HTMLElement {
  root;
  slideIndex = 0;
  slideOrder = 1;

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

  changeSlideIndex = (index: number) => {
    this.slideIndex += index;
  };

  // Create and add a specified fieldset with move and delete buttons added when appropriate
  handleSelecterButtonClicked = (e: Event) => {
    // Search for node with the specified css selecter by tranversing the element and its parents
    const isSelecterButton = (e.currentTarget as HTMLButtonElement).closest(
      "#slide-selecterButton"
    );
    if (!isSelecterButton) return;
    const slideValue = this.getSlideValue();
    if (!slideValue) return;
    this.changeSlideIndex(1);
    const fieldSet = this.createFieldSet(this.slideIndex, slideValue);
    this.insertNewFieldSet(fieldSet);
    this.handleAttachDeleteFieldSetHandler(fieldSet)
    this.handleAddMoveButtons();
    this.handleSlideOrderAdjustment()
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
    const fieldSet = document.createElement("div") as HTMLDivElement;
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
            <input type="hidden" name="slideOrder" id="slideOrderInput"/>
        </fieldset>
        <div class="fieldSetButtons">
            <button class="deleteFieldSet" type="button">X</button>
        </div>
        `;
      return fieldSet;
    } else {
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
            <label>Enter the wrong answer (Optional)
                <input type="text" name="question[${index}][wronganswer2]" />
            </label>
            <label>Enter the wrong answer (Optional)
                <input type="text" name="question[${index}][wronganswer3]" />
            </label>
            <input type="hidden" name="slideOrder" id="slideOrderInput"/>
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
    this.resetMoveButtons(fieldSetButtons)
    this.attachMoveButtons(fieldSetButtons)

    // Adjust slide order for slides
    this.handleSlideOrderAdjustment()
  };

  // get all the fieldSetButtons divs from the fieldsets
  getAllFieldSetButtons = () => {
    return Array.from(
      this.root.querySelectorAll(".fieldSetButtons")
    ) as HTMLDivElement[];
  };

  // Attach move buttons based on fieldset positioning
  attachMoveButtons = (fieldButtonContainers: HTMLDivElement[]) => {
    const numOfFieldSets = fieldButtonContainers.length
    fieldButtonContainers.forEach((fieldButtons, index) => {
        if(numOfFieldSets === 1) return
        else if(index === 0){
            this.attachMoveDownButton(fieldButtons)
        }
        else if(index === (numOfFieldSets - 1)){
            this.attachMoveUpButton(fieldButtons)
        }
        else{
            this.attachMoveUpButton(fieldButtons)
            this.attachMoveDownButton(fieldButtons)
        }
    });
  };

  attachMoveUpButton = (fieldSetButtons: HTMLDivElement) => {
    const upButton = document.createElement("button") as HTMLButtonElement;
    upButton.className = "up";
    upButton.textContent = "up"
    upButton.type = "button"
    upButton.addEventListener("click", this.handleMoveFieldSet)
    fieldSetButtons.appendChild(upButton);
  };

  attachMoveDownButton = (fieldSetButtons: HTMLDivElement) => {
    const downButton = document.createElement("button") as HTMLButtonElement;
    downButton.className = "down";
    downButton.textContent = "down"
    downButton.type = "button"
    downButton.addEventListener("click", this.handleMoveFieldSet)
    fieldSetButtons.appendChild(downButton);
  };

  resetMoveButtons = (fieldSetButtonsContainers:HTMLElement[])=>{
    fieldSetButtonsContainers.forEach(fieldSetButtons=>{
        fieldSetButtons.querySelector(".up")?.remove()
        fieldSetButtons.querySelector(".down")?.remove()
    })
  }

  handleAttachDeleteFieldSetHandler = (fieldSet:HTMLDivElement)=>{
    const deleteFieldSetButton = fieldSet.querySelector('.deleteFieldSet') as HTMLButtonElement
    deleteFieldSetButton.addEventListener("click", this.deleteFieldSet)
  }

  // Delete a fieldset and rearrange move buttons
  deleteFieldSet=(e:Event)=>{
    const button = e.currentTarget as HTMLButtonElement
    const fieldSet = button.closest(".slide-fieldSet")
    fieldSet?.remove()

    // Remove and add new appropriate move buttons
    this.handleAddMoveButtons();

    // Adjust slide order for slides
    this.handleSlideOrderAdjustment()
  }

  // Switch the placement of field sets
  handleMoveFieldSet = (e:Event)=>{
    const button = e.currentTarget as HTMLButtonElement
    const value = button.className
    if(value === "up"){
        const currentFieldSet = button.closest(".slide-fieldSet") as HTMLDivElement
        const previousFieldSet = currentFieldSet?.previousElementSibling as HTMLDivElement
        previousFieldSet.before(currentFieldSet)
    }
    else if(value === "down"){
        const currentFieldSet = button.closest(".slide-fieldSet") as HTMLDivElement
        const nextFieldSet = currentFieldSet?.nextElementSibling as HTMLDivElement
        currentFieldSet.before(nextFieldSet)
    }

    // Remove and add new appropriate move buttons
    this.handleAddMoveButtons();
  }

  handleSlideOrderAdjustment = ()=>{
    const inputs = this.getAllSlideOrderInputs()
    this.adjustSlideOrderInputs(inputs)
  }

  getAllSlideOrderInputs = ()=>{
    return Array.from(this.root.querySelectorAll('#slideOrderInput')) as HTMLInputElement[];
  }

  adjustSlideOrderInputs = (inputs:HTMLInputElement[])=>{
    inputs.forEach((input, index)=>{
        input.value = `${index + 1}`
    })
  }


  connectedCallback = () => {};

  disconnectedCallback = () => {};

  connectedMoveCallback = () => {};
}

customElements.define("lesson-creater", LessonCreater);
