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
  isFirstSlide = false;
  root: ShadowRoot | null = null;

  constructor() {
    super();
  }

  connectedCallback() {
    const template = document.getElementById(
      "intro-slide"
    ) as HTMLTemplateElement;

    // Ref the template, clone content and attach to root
    const templateContent = template.content;

    const clonedContent = templateContent.cloneNode(true) as DocumentFragment;

    this.root = this.attachShadow({ mode: "closed" });

    // Add text toe targetword and definition spans
    const targetWord = clonedContent.querySelector(
      ".targetWord"
    ) as HTMLElement;
    const definition = clonedContent.querySelector(
      ".definition"
    ) as HTMLElement;

    targetWord.textContent = this.targetWord;
    definition.textContent = this.definition;

    // Ref buttons and create event for slider navigation

    const backButton = clonedContent.querySelector(
      ".back"
    ) as HTMLButtonElement;

    const backButtonClicked = new CustomEvent("backButtonClicked", {
      bubbles: true,
      composed: true,
    });

    backButton.addEventListener("click", () => {
      this.dispatchEvent(backButtonClicked);
    });

     // Only display back button if the slide is not the first slide of the lesson
     if(this.isFirstSlide) backButton.style.display = "none"

    const nextButton = clonedContent.querySelector(
      ".next"
    ) as HTMLButtonElement;

    // Need to pass an object to allow the event to not only bubble up and but also leave out of shadow root
    const nextButtonClicked = new CustomEvent("nextButtonClicked", {
      bubbles: true,
      composed: true,
    });

    nextButton.addEventListener("click", () => {
      this.dispatchEvent(nextButtonClicked);
    });

    this.root.appendChild(clonedContent);
  }

  disconnectedCallback() {}

  setData = (introSlideData: IntroSlideData, isFirstSlide: boolean) => {
    this.targetWord = introSlideData.targetWord;
    this.definition = introSlideData.definition;
    this.isFirstSlide = isFirstSlide;
  };
}

customElements.define("intro-slide", IntroSlide);
