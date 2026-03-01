import "./AudioInputTab.ts";
import "./AudioInputRecorder.ts";
export default class AudioInput extends HTMLElement {
    private root;
    private inputFileButton;
    private recorderButton;
    private store;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(): void;
    handleChangeInputFile: (event: Event) => void;
    handleAudioFilesChanged: () => void;
    handleAudioRecorderButtonClicked: () => void;
}
//# sourceMappingURL=AudioInput.d.ts.map