export declare class GroupNameSelector extends HTMLElement {
    static formAssociated: boolean;
    internals: ElementInternals;
    root: ShadowRoot;
    constructor();
    connectedCallback(): void;
    onInputChange: (e: Event) => void;
    onSelectChange: (e: Event) => void;
    setGroupName: (groupname: string) => void;
}
//# sourceMappingURL=GroupNameSelector.d.ts.map