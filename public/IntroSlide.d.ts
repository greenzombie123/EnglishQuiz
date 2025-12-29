export type IntroSlideData = {
    type: "intro";
    targetWord: string;
    definition: string;
    sliderOrder: number;
};
export declare class IntroSlide extends HTMLElement {
    targetWord: string;
    definition: string;
    isFirstSlide: boolean;
    root: ShadowRoot | null;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    setData: (introSlideData: IntroSlideData, isFirstSlide: boolean) => void;
}
//# sourceMappingURL=IntroSlide.d.ts.map