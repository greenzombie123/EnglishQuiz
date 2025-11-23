export type QuestionSlideType = {
  id: number;
  type: "question";
  question: string;
  correctAnswer: string;
  wrongAnswer1: string;
  wrongAnswer2: string;
  wrongAnswer3: string;
};

class QuestionSlide extends HTMLElement{
      constructor(){
        super()
    }

    connectedCallback() {
        // const template = document.getElementById("lesson-slider") as HTMLTemplateElement
        // const templateContent = template.content
        // const clonedContent = templateContent.cloneNode(true)
        // const shadowRoot = this.attachShadow({mode:"closed"})
        // shadowRoot.appendChild(clonedContent)
    }

    disconnectedCallback() {

    }
}

customElements.define("question-slide", QuestionSlide)