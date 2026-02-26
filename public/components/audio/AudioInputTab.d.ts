import "../utility/PopUpModal.ts";
export default class AudioInputTab extends HTMLElement {
    private root;
    private audioFile;
    private audio;
    private store;
    static observedAttributes: string[];
    constructor();
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    connectedCallback(): Error | undefined;
    setAudioUrl(file: File): void;
    handleDeleteButtonClicked: () => void;
    handleRemoveAudioFile: () => Error | undefined;
}
//# sourceMappingURL=AudioInputTab.d.ts.map