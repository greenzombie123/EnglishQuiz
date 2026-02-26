import { lesssonCreaterStore } from "../store/LessonCreaterStore.ts";
import "./AudioInputTab.ts";
import type AudioInputTab from "./AudioInputTab.ts";
import Store from "../store/store.ts";

export default class AudioInput extends HTMLElement {
  private root;
  private inputFileButton: HTMLInputElement;
  private store;

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "closed" });
    const template = document.getElementById(
      "audio-input",
    ) as HTMLTemplateElement;

    this.root.appendChild(template.content.cloneNode(true));

    this.inputFileButton = this.root.querySelector(
      "#audio_file_input",
    ) as HTMLInputElement;

    this.addEventListener("change", this.handleChangeInputFile);

    this.inputFileButton.addEventListener("change", this.handleChangeInputFile);

    this.store = lesssonCreaterStore;

    // Subscribe to store events
    this.store.subscribe("audioFilesChanged", this.handleAudioFilesChanged);
  }

  connectedCallback() {}

  disconnectedCallback() {}

  attributeChangedCallback() {}

  handleChangeInputFile = (event: Event) => {
    const files = (event.target as HTMLInputElement).files;

    if (files && files[0]) {
      const audioFiles = this.store.getState("audioFiles");

      const newAudioFiles = [...audioFiles, files[0]];

      this.store.setState("audioFiles", newAudioFiles);
    }
  };

  handleAudioFilesChanged = () => {
    const audioFiles = this.store.getState("audioFiles");

    const ul = this.root.querySelector("ul") as HTMLUListElement;

    ul.replaceChildren();

    const soundFileNames = this.root.querySelector(
      ".soundFileNames",
    ) as HTMLParagraphElement;

    soundFileNames.textContent = `There is ${audioFiles.length} files`;

    audioFiles.forEach((audioFile) => {
     
      const audioInputTab = document.createElement(
        "audio-input-tab",
      ) as AudioInputTab;
      
      audioInputTab.setAudioUrl(audioFile)
      
      ul.appendChild(audioInputTab);
    });
  };

}

customElements.define("audio-input", AudioInput);
