"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slideState = void 0;
const slideState = () => {
    let slides;
    let currentSlideIndex = 0;
    const isFirstSlide = () => currentSlideIndex === 0;
    const isLastSlide = () => slides.length - 1 === currentSlideIndex;
    const changeSlide = (nextIndex) => {
        currentSlideIndex += nextIndex;
        if (currentSlideIndex < 0)
            currentSlideIndex = 0;
    };
    const setSlides = (newSlides) => {
        slides = newSlides;
    };
    const getCurrentSlide = () => slides[currentSlideIndex];
    const getCurrentSlideIndex = () => currentSlideIndex;
    return {
        changeSlide,
        setSlides,
        getCurrentSlide,
        isLastSlide,
        getCurrentSlideIndex,
        isFirstSlide
    };
};
exports.slideState = slideState;
//# sourceMappingURL=SlideState.js.map