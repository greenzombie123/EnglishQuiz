export const slideState = () => {
    let slides;
    let currentSlideIndex = 0;
    const isLastSlide = () => slides.length + 1 === currentSlideIndex;
    const changeSlide = (nextIndex) => {
        currentSlideIndex = +nextIndex;
    };
    const setSlides = (newSlides) => {
        slides = newSlides;
        console.log(slides);
    };
    const getCurrentSlide = () => {
        return slides[currentSlideIndex];
    };
    return {
        changeSlide,
        setSlides,
        getCurrentSlide,
        isLastSlide
    };
};
//# sourceMappingURL=SlideState.js.map