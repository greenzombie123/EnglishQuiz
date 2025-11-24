export const slideState = () => {
    let slides;
    let currentSlideIndex = 0;
    const isLastSlide = () => slides.length + 1 === currentSlideIndex;
    const changeSlide = (nextIndex) => {
        currentSlideIndex = +nextIndex;
    };
    const setSlides = (newSlides) => {
        slides = newSlides;
    };
    const getCurrentSlide = () => slides[currentSlideIndex] || null;
    return {
        changeSlide,
        setSlides,
        getCurrentSlide,
        isLastSlide,
    };
};
//# sourceMappingURL=SlideState.js.map