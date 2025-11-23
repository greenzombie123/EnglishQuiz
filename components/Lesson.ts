import { IntroSlideType } from "./IntroSlide.ts";
import { QuestionSlideType } from "./QuestionSlide.ts";


type Slide = IntroSlideType | QuestionSlideType;

const slideState = () => {
  const slides: Slide[] = [];
  const currentSlideIndex: number | "Finished" = 0;

  const changeSlide = (nextIndex: number) => {};
  const setSlides = (slides: Slide[]) => {};
  const getCurrentSlide = () => {};

  return {
    changeSlide,
    setSlides,
    getCurrentSlide,
  };
};

class Lesson extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback() {
        const template = document.getElementById("lesson-slider") as HTMLTemplateElement
        const templateContent = template.content
        const clonedContent = templateContent.cloneNode(true)
        const shadowRoot = this.attachShadow({mode:"closed"})
        shadowRoot.appendChild(clonedContent)
    }

    disconnectedCallback() {

    }
}

customElements.define("lesson-slider", Lesson)



