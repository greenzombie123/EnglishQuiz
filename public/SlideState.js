export const slideState = () => {
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
    const getCurrentSlide = () => slides[currentSlideIndex] || null;
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
//# sourceMappingURL=SlideState.js.map