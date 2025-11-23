const slideState = () => {
    const slides = [];
    const currentSlideIndex = 0;
    const changeSlide = (nextIndex) => { };
    const setSlides = (slides) => { };
    const getCurrentSlide = () => { };
    return {
        changeSlide,
        setSlides,
        getCurrentSlide,
    };
};
class Lesson extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        const template = document.getElementById("lesson-slider");
        const templateContent = template.content;
        const clonedContent = templateContent.cloneNode(true);
        const shadowRoot = this.attachShadow({ mode: "closed" });
        shadowRoot.appendChild(clonedContent);
    }
    disconnectedCallback() {
    }
}
customElements.define("lesson-slider", Lesson);
export {};
//# sourceMappingURL=Lesson.js.map