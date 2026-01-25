import type { SlideRecord } from "../shared.types.ts";
export type SlideState = {
    changeSlide(nextIndex: number): void;
    setSlides(slides: SlideRecord[]): void;
    getCurrentSlide(): SlideRecord;
    isLastSlide(): boolean;
    getCurrentSlideIndex(): number;
    isFirstSlide(): boolean;
};
export declare const slideState: () => SlideState;
//# sourceMappingURL=SlideState.d.ts.map