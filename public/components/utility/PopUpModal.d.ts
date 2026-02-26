export declare class PopUpModal extends HTMLElement {
    #private;
    root: ShadowRoot;
    dialog: HTMLDialogElement;
    topMessage: HTMLParagraphElement;
    bottomMessage: HTMLParagraphElement;
    yesButton: HTMLButtonElement;
    noButton: HTMLButtonElement;
    constructor();
    connectedCallback(): void;
    showPopUpModal: (topMessage: string, bottomMessage?: string, onYesClickHandler?: () => void) => void;
}
//# sourceMappingURL=PopUpModal.d.ts.map