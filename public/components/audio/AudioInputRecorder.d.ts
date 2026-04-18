export default class AudioInputRecorder extends HTMLElement {
    #private;
    private store;
    private root;
    private mediaRecorder;
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
    private mimeType;
    private audioFile;
    constructor();
    connectedCallback(): void;
    handleAudioFileCreated: () => void;
    getMedia(): Promise<boolean>;
    open(): Promise<void>;
}
//# sourceMappingURL=AudioInputRecorder.d.ts.map