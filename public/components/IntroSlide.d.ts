import type { IntroSlideRecord } from "../shared.types.ts";
export declare class IntroSlide extends HTMLElement {
    targetWord: string;
    definition: string;
    isFirstSlide: boolean;
    root: ShadowRoot | null;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    setData: (introSlideData: IntroSlideRecord, isFirstSlide: boolean) => void;
}
//# sourceMappingURL=IntroSlide.d.ts.map