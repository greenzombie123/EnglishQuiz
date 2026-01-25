export declare class DeleteLessonDialog extends HTMLElement {
    #private;
    root: ShadowRoot;
    dialog: HTMLDialogElement;
    topMessage: HTMLParagraphElement;
    bottomMessage: HTMLParagraphElement;
    yesButton: HTMLButtonElement;
    noButton: HTMLButtonElement;
    returnButton: HTMLAnchorElement;
    href: string;
    lessonname: string;
    constructor();
    connectedCallback(): void;
    showDeleteDialog: (lessonname: string, href: string) => void;
}
//# sourceMappingURL=DeleteLessonDialog.d.ts.map