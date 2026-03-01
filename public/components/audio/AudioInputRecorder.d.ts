export default class AudioInputRecorder extends HTMLElement {
    private store;
    private root;
    private stream;
    private dialog;
    private startButton;
    private stopButton;
    private playButton;
    private name;
    private finishButton;
    private cancelButton;
    constructor();
    connectedCallback(): void;
    handleAudioFileCreated: () => void;
    getMedia(): Promise<boolean>;
    open(): Promise<void>;
}
//# sourceMappingURL=AudioInputRecorder.d.ts.map