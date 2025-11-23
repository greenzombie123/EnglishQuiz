import "./IntroSlide.ts";
import "./QuestionSlide.ts"

export interface HTMLLessonSlider extends HTMLElement{

}

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



