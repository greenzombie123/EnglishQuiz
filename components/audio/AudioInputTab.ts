import { lesssonCreaterStore } from "../store/LessonCreaterStore.ts";
import type { PopUpModal } from "../utility/PopUpModal.ts";
import "../utility/PopUpModal.ts";

export default class AudioInputTab extends HTMLElement {
  private root;
  private audioFile: File | null = null;
  private audio;
  private store;

  static observedAttributes = ["fileName"];

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "closed" });
    const template = document.getElementById(
      "audio-input-tab",
    ) as HTMLTemplateElement;

    this.root.appendChild(template.content.cloneNode(true));

    this.audio = this.root.querySelector("audio") as HTMLAudioElement;

    this.store = lesssonCreaterStore;
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {}

  connectedCallback() {
    if (!this.audioFile) return Error("No audio file was set");

    const url = URL.createObjectURL(this.audioFile);
    this.audio.src = url;

    const span = this.root.querySelector("span") as HTMLSpanElement;
    span.textContent = this.audioFile.name.slice(0, -4);

    const playButton = this.root.querySelector(".play") as HTMLButtonElement;
    const deleteButton = this.root.querySelector(
      ".delete",
    ) as HTMLButtonElement;

    playButton.addEventListener("click", () => {
      this.audio.play();
    });

    deleteButton.addEventListener("click", this.handleDeleteButtonClicked);
  }

  setAudioUrl(file: File) {
    this.audioFile = file;
  }

  handleDeleteButtonClicked=()=> {
    const popUpModal = document.createElement("pop-up-modal") as PopUpModal;

    const topMessage = `Delete this audio file?`
    const bottomMessage = `${this.audioFile ? this.audioFile.name : ""}`

    this.root.appendChild(popUpModal)

    popUpModal.showPopUpModal(topMessage, bottomMessage, this.handleRemoveAudioFile)
  }

  handleRemoveAudioFile = () => {
    if (!this.audioFile) return Error("No audio file was set");

    const audioFiles = this.store.getState("audioFiles");
    const deletingAudioFile = this.audioFile;

    const newAudioFiles = audioFiles.filter(
      (audioFile) => audioFile.name !== deletingAudioFile.name,
    );
    this.store.setState("audioFiles", newAudioFiles);
  };
}

customElements.define("audio-input-tab", AudioInputTab);
