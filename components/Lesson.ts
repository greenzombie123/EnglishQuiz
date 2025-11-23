import "./IntroSlide.ts";
import "./QuestionSlide.ts"
import type { Slide } from "./SlideState.ts";

export interface HTMLLessonSlider extends HTMLElement{

}

export type Lesson = {
    id:number,
    name:string,
    slides:Slide[]
} 

export type LessonData = {

}

class LessonSlider extends HTMLElement{
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

customElements.define("lesson-slider", LessonSlider)



