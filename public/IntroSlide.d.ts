export type IntroSlideData = {
    id: number;
    type: "intro";
    targetWord: string;
    definition: string;
    sliderOrder: number;
};
export declare class IntroSlide extends HTMLElement {
    targetWord: string;
    definition: string;
    root: ShadowRoot | null;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    setData: (introSlideData: IntroSlideData) => void;
}
//# sourceMappingURL=IntroSlide.d.ts.map