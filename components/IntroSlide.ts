export type IntroSlideData = {
  id: number;
  type: "intro";
  targetWord: string;
  definition: string;
  sliderOrder: number;
};

export class IntroSlide extends HTMLElement {
  targetWord = "";
  definition = "";
  root:ShadowRoot| null = null


  constructor() {
    super();
  }

  connectedCallback() {
    const template = document.getElementById(
      "intro-slide"
    ) as HTMLTemplateElement;

    const templateContent = template.content;

    const clonedContent = templateContent.cloneNode(true) as DocumentFragment

    this.root = this.attachShadow({ mode: "closed" });

    const targetWord = clonedContent.querySelector(".targetWord") as HTMLElement
    const definition = clonedContent.querySelector(".definition") as HTMLElement
    const backtButton = clonedContent.querySelector(".next") as HTMLButtonElement
    const nextButton = clonedContent.querySelector(".back") as HTMLButtonElement

    targetWord.textContent = this.targetWord
    definition.textContent = this.definition


    this.root.appendChild(clonedContent);
  }

  disconnectedCallback() {}

  setData= (introSlideData:IntroSlideData) => {
    this.targetWord = introSlideData.targetWord
    this.definition = introSlideData.definition
  };
}

customElements.define("intro-slide", IntroSlide);

const g = document.createElement("intro-slide") as IntroSlide;
