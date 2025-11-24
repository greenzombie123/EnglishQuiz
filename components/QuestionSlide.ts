export type QuestionSlideData = {
  id: number;
  type: "question";
  question: string;
  correctAnswer: string;
  wrongAnswer1: string;
  wrongAnswer2: string;
  wrongAnswer3: string;
  sliderOrder:number
};

export class QuestionSlide extends HTMLElement{
    correctAnswer: string = ""
    wrongAnswer1: string = ""
    wrongAnswer2: string = ""
    wrongAnswer3: string = ""
  
    constructor() {
      super();
    }
  
    connectedCallback() {
      const template = document.getElementById(
        "question-slide"
      ) as HTMLTemplateElement;
      const templateContent = template.content;
      const clonedContent = templateContent.cloneNode(true);
      const shadowRoot = this.attachShadow({ mode: "closed" });
      shadowRoot.appendChild(clonedContent);
    }
  
    disconnectedCallback() {}
  
    setData = (questionSlideData:QuestionSlideData) => {
      this.correctAnswer = questionSlideData.correctAnswer
      this.wrongAnswer1 = questionSlideData.wrongAnswer1
      this.wrongAnswer2 = questionSlideData.wrongAnswer2
      this.wrongAnswer3 = questionSlideData.wrongAnswer3
    };
}

customElements.define("question-slide", QuestionSlide)