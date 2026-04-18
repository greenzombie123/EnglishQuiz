import { lesssonCreaterStore } from "../store/LessonCreaterStore.ts";

export default class AudioInputRecorder extends HTMLElement {
  private store;
  private root;
  private mediaRecorder: MediaRecorder | undefined;
  private dialog;
  private startButton;
  private stopButton;
  private playButton;
  private name;
  private finishButton;
  private cancelButton;
  private indicator;
  private audio;
  private warning;
  private mimeType = "";
  private audioFile: { url: string; file: Blob } | null = null;

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "closed" });
    const template = document.getElementById(
      "audio-input-recorder",
    ) as HTMLTemplateElement;

    this.root.appendChild(template.content.cloneNode(true));

    this.dialog = this.root.querySelector("dialog") as HTMLDialogElement;
    this.startButton = this.root.querySelector(".start") as HTMLButtonElement;
    this.stopButton = this.root.querySelector(".stop") as HTMLButtonElement;
    this.playButton = this.root.querySelector(".play") as HTMLButtonElement;
    this.name = this.root.querySelector("#name") as HTMLInputElement;
    this.finishButton = this.root.querySelector(".finish") as HTMLButtonElement;
    this.cancelButton = this.root.querySelector(".cancel") as HTMLButtonElement;
    this.indicator = this.root.querySelector(".circle") as HTMLDivElement;
    this.audio = this.root.querySelector("audio") as HTMLAudioElement;
    this.warning = this.root.querySelector(".warning") as HTMLSpanElement;

    // Add listeners to buttons and inputs

    this.startButton.addEventListener("click", this.#handleStartRecording);
    this.stopButton.addEventListener("click", this.#handleStopRecording);
    this.playButton.addEventListener("click", this.#handlePlayRecording);
    this.audio.addEventListener("ended", () =>
      this.#changeIndicatorColor("inactive"),
    );
    this.cancelButton.addEventListener("click", this.#handleCloseDialog);
    this.finishButton.addEventListener("click", this.#handleUpdateAudioFiles);

    this.store = lesssonCreaterStore;

    this.store.subscribe("audioFilesChanged", this.handleAudioFileCreated);
  }

  connectedCallback() {}

  handleAudioFileCreated = () => {};

  async getMedia() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = 'audio/webm;codecs=opus'
      this.mediaRecorder = new MediaRecorder(stream, {mimeType});

      // When the media recorder stops, get the blob from the captured media
      this.mediaRecorder.ondataavailable = this.#handleSetAudioUrl;

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async open() {
    this.dialog.showModal();
    const canUseMedia = await this.getMedia();
    if (!canUseMedia) this.dialog.close();
  }

  #handleStartRecording = () => {
    if (
      this.mediaRecorder &&
      this.mediaRecorder.state === "inactive" &&
      this.audio.paused
    ) {
      if (this.audioFile) {
        URL.revokeObjectURL(this.audioFile.url);
        this.audioFile = null;
      }

      this.#changeIndicatorColor("recording");

      this.mediaRecorder.start();
    }
  };

  #handleStopRecording = () => {
    if (
      this.mediaRecorder &&
      this.mediaRecorder.state === "recording" &&
      this.audio.paused
    ) {
      this.#changeIndicatorColor("inactive");

      this.mediaRecorder.stop();
    }
  };

  #handlePlayRecording = () => {
    if (
      this.mediaRecorder &&
      this.mediaRecorder.state === "inactive" &&
      this.audioFile
    ) {
      this.audio.src = this.audioFile.url;
      this.audio.play();
      this.#changeIndicatorColor("playing");
    }
  };

  #handleUpdateAudioFiles = () => {
    if (!this.audioFile?.file)
      return this.#giveWarning("No file has been recorded yet.");
    if (!this.#hasName())
      return this.#giveWarning("Write the name of the audio file");
    if (!this.#hasNewName())
      return this.#giveWarning("Another audio file has the same name.");

    // Grab the audio files and add the newly recorded one to the array and set as new state

    const audioFiles = this.store.getState("audioFiles")
    const newAudioFile = new File([this.audioFile.file], this.name.value + '.webm', {type:this.audioFile.file.type})
    console.log(newAudioFile.name)
    this.store.setState("audioFiles", [...audioFiles, newAudioFile])

    this.#handleCloseDialog();
  };

  #handleCloseDialog = () => {
    URL.revokeObjectURL(this.audioFile?.url || "");
    this.audioFile = null;
    this.audio.src = "";
    this.name.value = "";
    this.dialog.close();
  };

  #handleSetAudioUrl = (event: BlobEvent) => {
    this.audioFile = { url: URL.createObjectURL(event.data), file: event.data };
  };

  #changeIndicatorColor = (
    state: Exclude<RecordingState, "paused"> | "playing",
  ) => {
    switch (state) {
      case "recording":
        this.indicator.style.backgroundColor = "red";
        break;
      case "inactive":
        this.indicator.style.backgroundColor = "black";
        break;
      case "playing":
        this.indicator.style.backgroundColor = "green";
        break;
      default:
        break;
    }
  };

  #hasName = () => this.name.value !== "";

  #hasNewName = () => {
    const audioFilesNames = this.store
      .getState("audioFiles")
      .map((audioFile) => audioFile.name)

    if(!audioFilesNames.length) return true

    return audioFilesNames.some(
      (audioFilesName) => audioFilesName !== this.name.value,
    );
  };

  #hasAudioFile = () => this.audioFile !== null;

  #giveWarning = (message: string) => {
    this.warning.textContent = message;
  };
}

customElements.define("audio-input-recorder", AudioInputRecorder);
