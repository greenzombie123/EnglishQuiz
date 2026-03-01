import { lesssonCreaterStore } from "../store/LessonCreaterStore.ts";

export default class AudioInputRecorder extends HTMLElement {
  private store;
  private root;
  private stream: MediaStream | null = null;
  private dialog;
  private startButton;
  private stopButton;
  private playButton;
  private name;
  private finishButton;
  private cancelButton;

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "closed" });
    const template = document.getElementById(
      "audio-input-recorder",
    ) as HTMLTemplateElement;

    this.root.appendChild(template.content.cloneNode(true));

    this.dialog = this.root.querySelector("dialog") as HTMLDialogElement;
    this.startButton = this.root.querySelector(".start") as HTMLDialogElement;
    this.stopButton = this.root.querySelector(".stop") as HTMLDialogElement;
    this.playButton = this.root.querySelector(".play") as HTMLDialogElement;
    this.name = this.root.querySelector("#name") as HTMLDialogElement;
    this.finishButton = this.root.querySelector(".finish") as HTMLDialogElement;
    this.cancelButton = this.root.querySelector(".cancel") as HTMLDialogElement;

    this.store = lesssonCreaterStore;

    this.store.subscribe("audioFilesChanged", this.handleAudioFileCreated);
  }

  connectedCallback() {}

  handleAudioFileCreated = () => {};

  async getMedia() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return true
    } catch (error) {
      this.stream = null;
      console.error(error)
      return false
    }
  }

  async open(){
    this.dialog.showModal()
    const canUseMedia = await this.getMedia()
    if(!canUseMedia) this.dialog.close()
  }
}

customElements.define("audio-input-recorder", AudioInputRecorder);
