import {
  IntroSlideRecord,
  QuestionSlideRecord,
  SlideRecord,
} from "../shared.types.ts";
import "./FieldSet.ts";
import "./GroupNameSelector.ts";
import { GroupNameSelector } from "./GroupNameSelector.ts";
import "./audio/AudioInput.ts";
import { lesssonCreaterStore } from "./store/LessonCreaterStore.ts";

export type LessonInfo = {
  name: string;
  groupname: string;
  slides: (IntroSlideRecord | QuestionSlideRecord)[];
};

class LessonCreater extends HTMLElement {
  root;
  slideIndex = 0;
  lessonId: string | null = null;
  private store;
  static observedAttributes = ["data-lessonid"];

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "closed" });
    const template = document.getElementById(
      "lesson-creater",
    ) as HTMLTemplateElement;

    this.root.appendChild(template.content.cloneNode(true));

    const selecterButton = this.root.getElementById(
      "slide-selecterButton",
    ) as HTMLButtonElement;

    selecterButton.addEventListener("click", this.handleSelecterButtonClicked);

    this.store = lesssonCreaterStore;

    // Subscribe to store events
    this.store.subscribe("audioFilesChanged", this.#handleAddSoundSelect);
    this.store.subscribe("audioFilesChanged", this.#handleUpdateSoundSelect);
  }

  connectedCallback() {}

  async attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string,
  ) {
    if (name === "data-lessonid" && newValue) {
      this.lessonId = newValue;
      const lesson = await this.#getLessonSlides(this.lessonId);
      this.#fillFieldSets(lesson);
      //TODO Check to see if there are any audio files when receieve response from server
      return;
    }
    console.log("nothing!");
  }

  changeSlideIndex = (index: number) => {
    this.slideIndex += index;
  };

  // Create and add a specified fieldset with move and delete buttons added when appropriate
  handleSelecterButtonClicked = (e: Event) => {
    // Search for node with the specified css selecter by tranversing the element and its parents
    const isSelecterButton = (e.currentTarget as HTMLButtonElement).closest(
      "#slide-selecterButton",
    );
    if (!isSelecterButton) return;
    const slideValue = this.getSlideValue();
    if (!slideValue) return;
    this.changeSlideIndex(1);
    const fieldSet = this.createFieldSet(this.slideIndex, slideValue);
    this.insertNewFieldSet(fieldSet);
    this.handleAttachDeleteFieldSetHandler(fieldSet);
    this.handleAddMoveButtons();
  };

  // Get value from the select in the slide selecter
  getSlideValue = () => {
    const select = this.root.getElementById(
      "slideSelecter",
    ) as HTMLSelectElement;
    return select.value;
  };

  // Place new fieldset just before the slide selecter
  insertNewFieldSet = (fieldSet: HTMLElement) => {
    const slideSelecter = this.root.querySelector(
      ".slideSelecter",
    ) as HTMLElement;
    slideSelecter.before(fieldSet);
  };

  createFieldSet = (
    index: number,
    fieldSetType: string,
    slideData?: SlideRecord,
  ) => {
    const fieldSet = document.createElement("div") as HTMLDivElement;
    if (fieldSetType === "intro") {
      fieldSet.className = "slide-fieldSet";
      fieldSet.innerHTML = `
            <fieldset>
            <legend>Introduction</legend>
            <label>Enter the target word
                <input type="text" name="intro[${index}][targetword]" required ${
                  slideData?.type === "intro"
                    ? "value=" + slideData.targetword
                    : ""
                } />
            </label>
            <label>Enter definition of target word
                <input type="text" name="intro[${index}][definition]" required ${
                  slideData?.type === "intro"
                    ? "value=" + slideData.definition
                    : ""
                } />
            </label>
            <input type="hidden" name="intro[${index}][slideorder]" id="slideOrderInput" ${
              slideData?.type === "intro" ? "value=" + slideData.slideorder : ""
            } />
            ${this.store.getState("audioFiles").length !== 0 ? this.#attachSoundSelectToFieldSet() : ""}
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
                <input type="text" name="question[${index}][question]" required ${
                  slideData?.type === "question"
                    ? "value=" + slideData.question
                    : ""
                } />
            </label>
            <label>Enter the correct answer
                <input type="text" name="question[${index}][correctanswer]" required  ${
                  slideData?.type === "question"
                    ? "value=" + slideData.correctanswer
                    : ""
                } />
            </label>
            <label>Enter the wrong answer
                <input type="text" name="question[${index}][wronganswer1]" required ${
                  slideData?.type === "question"
                    ? "value=" + slideData.wronganswer1
                    : ""
                } />
            </label>
            <label>Enter the wrong answer (Optional)
                <input type="text" name="question[${index}][wronganswer2]" ${
                  slideData?.type === "question" && slideData.wronganswer2
                    ? "value=" + slideData.wronganswer2
                    : ""
                } />
            </label>
            <label>Enter the wrong answer (Optional)
                <input type="text" name="question[${index}][wronganswer3]" ${
                  slideData?.type === "question" && slideData.wronganswer3
                    ? "value=" + slideData.wronganswer3
                    : ""
                } />
            </label>
            <input type="hidden" name="question[${index}][slideorder]" id="slideOrderInput" ${
              slideData?.type === "question"
                ? "value=" + slideData.slideorder
                : ""
            } />
            ${this.store.getState("audioFiles").length !== 0 ? this.#attachSoundSelectToFieldSet() : ""}
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
    return Array.from(
      this.root.querySelectorAll(".fieldSetButtons"),
    ) as HTMLDivElement[];
  };

  // Attach move buttons based on fieldset positioning
  attachMoveButtons = (fieldButtonContainers: HTMLDivElement[]) => {
    const numOfFieldSets = fieldButtonContainers.length;
    fieldButtonContainers.forEach((fieldButtons, index) => {
      if (numOfFieldSets === 1) return;
      else if (index === 0) {
        const downButton = this.createMoveButton("down");
        this.appendMoveButtons(fieldButtons, [downButton]);
      } else if (index === numOfFieldSets - 1) {
        const upButton = this.createMoveButton("up");
        this.appendMoveButtons(fieldButtons, [upButton]);
      } else {
        const upButton = this.createMoveButton("up");
        const downButton = this.createMoveButton("down");
        this.appendMoveButtons(fieldButtons, [upButton, downButton]);
      }
    });
  };

  createMoveButton = (buttonType: string) => {
    const button = document.createElement("button") as HTMLButtonElement;
    button.className = buttonType;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "30px");
    svg.setAttribute("height", "30px");
    svg.setAttribute("viewBox", "0 0 15 15");
    svg.setAttribute("fill", "none");
    button.appendChild(svg);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      `${buttonType === "up" ? "M7.5 3L15 11H0L7.5 3Z" : "M7.49988 12L-0.00012207 4L14.9999 4L7.49988 12Z"}`,
    );
    path.setAttribute("fill", "#000000");
    svg.appendChild(path);

    button.type = "button";
    button.addEventListener("click", this.handleMoveFieldSet);
    return button;
  };

  appendMoveButtons = (
    fieldSetButtons: HTMLDivElement,
    moveButtons: HTMLButtonElement[],
  ) => {
    moveButtons.forEach((moveButton) => {
      fieldSetButtons.appendChild(moveButton);
    });
  };

  resetMoveButtons = (fieldSetButtonsContainers: HTMLElement[]) => {
    fieldSetButtonsContainers.forEach((fieldSetButtons) => {
      fieldSetButtons.querySelector(".up")?.remove();
      fieldSetButtons.querySelector(".down")?.remove();
    });
  };

  handleAttachDeleteFieldSetHandler = (fieldSet: HTMLDivElement) => {
    const deleteFieldSetButton = fieldSet.querySelector(
      ".deleteFieldSet",
    ) as HTMLButtonElement;
    deleteFieldSetButton.addEventListener("click", this.deleteFieldSet);
  };

  // Delete a fieldset and rearrange move buttons
  deleteFieldSet = (e: Event) => {
    const button = e.currentTarget as HTMLButtonElement;
    const fieldSet = button.closest(".slide-fieldSet");
    fieldSet?.remove();

    // Remove and add new appropriate move buttons
    this.handleAddMoveButtons();

    // Adjust slide order for slides
    this.handleSlideOrderAdjustment();
  };

  // Switch the placement of field sets
  handleMoveFieldSet = (e: Event) => {
    const button = e.currentTarget as HTMLButtonElement;
    const value = button.className;
    if (value === "up") {
      const currentFieldSet = button.closest(
        ".slide-fieldSet",
      ) as HTMLDivElement;
      const previousFieldSet =
        currentFieldSet?.previousElementSibling as HTMLDivElement;
      previousFieldSet.before(currentFieldSet);
    } else if (value === "down") {
      const currentFieldSet = button.closest(
        ".slide-fieldSet",
      ) as HTMLDivElement;
      const nextFieldSet =
        currentFieldSet?.nextElementSibling as HTMLDivElement;
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
    return Array.from(
      this.root.querySelectorAll("#slideOrderInput"),
    ) as HTMLInputElement[];
  };

  adjustSlideOrderInputs = (inputs: HTMLInputElement[]) => {
    inputs.forEach((input, index) => {
      input.value = `${index + 1}`;
    });
  };

  #getLessonSlides = async (lessonId: string): Promise<LessonInfo> => {
    const response = await fetch(`/lessons/get/${lessonId}`);
    return response.json();
  };

  #fillFieldSets = ({ name, groupname, slides }: LessonInfo) => {
    const nameInput = this.root.getElementById(
      "lessonName",
    ) as HTMLInputElement;
    const groupNameInput = this.root.querySelector(
      "groupname-selecter",
    ) as GroupNameSelector;

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

  #handleAddSoundSelect = () => {
    const audioFiles = this.store.getState("audioFiles");

    // Check if there are any audio files and no sound selects
    if (!this.#hasSoundSelects() && audioFiles.length) {
      const fieldsets = Array.from(
        this.root.querySelectorAll("fieldSet"),
      ) as HTMLDivElement[];

      fieldsets.forEach((fieldset) => {
        const soundselect = this.#createSoundSelect();
        fieldset.appendChild(soundselect);
      });
    }
  };

  //addSoundSelect() {}

  #createSoundSelect() {
    const select = document.createElement("select") as HTMLSelectElement;
    select.classList.add("sound_select");
    select.name = "soundurl";

    const option = document.createElement("option") as HTMLOptionElement;
    option.value = "";
    option.textContent = "--- No Sound File is Chosen";
    //TODO Might need to change once we can recieve audio files from server
    option.selected = true;

    select.appendChild(option);

    const audioFiles = this.store.getState("audioFiles");

    audioFiles.forEach((audioFile) => {
      const option = document.createElement("option") as HTMLOptionElement;
      option.value = audioFile.name;
      option.textContent = audioFile.name.slice(0, -4);

      select.appendChild(option);
    });

    return select;
  }

  #hasSoundSelects() {
    return this.root.querySelectorAll(".sound_select").length !== 0;
  }

  #attachSoundSelectToFieldSet() {
    const audioFiles = this.store.getState("audioFiles");

    const options = audioFiles.map((audioFile) => {
      return `<option value=${audioFile.name}>${audioFile.name.slice(0, -4)}</option>`;
    });

    return `<select class="sound_select" name="soundurl">
      <option value="" selected>--- No Sound File Chosen</option>
      ${options.join("")}
    </select>`;
  }

  #handleUpdateSoundSelect=()=> {
    const audioFiles = this.store.getState("audioFiles");

    const soundSelects = Array.from(
      this.root.querySelectorAll(".sound_select"),
    ) as HTMLSelectElement[];

    soundSelects.forEach((soundSelect) => {

      const currentSoundFile = soundSelect.value 

      while (soundSelect.firstChild) {
        soundSelect.removeChild(soundSelect.firstChild);
      }

      const defaultOption = document.createElement(
        "option",
      ) as HTMLOptionElement;
      defaultOption.value = "";
      defaultOption.textContent = "--- No Sound Life is Chosen";

      const hasSelectedFile = audioFiles.some(
        (audioFile) => soundSelect.value === audioFile.name,
      );

      if (!hasSelectedFile) {
        soundSelect.value = "";
        defaultOption.selected = true;
      }

      soundSelect.appendChild(defaultOption)

      audioFiles.forEach((audioFile) => {
        const option = document.createElement("option") as HTMLOptionElement;
        option.value = audioFile.name;
        option.textContent = audioFile.name.slice(0, -4)
        soundSelect.appendChild(option)
        if(option.value === currentSoundFile) option.selected = true
      });
    });

  }

  disconnectedCallback() {}

  connectedMoveCallback() {}
}

customElements.define("lesson-creater", LessonCreater);
