import { check } from "express-validator";

export type QuestionSlideData = {
  id: number;
  type: "question";
  question: string;
  correctAnswer: string;
  wrongAnswer1: string;
  wrongAnswer2: string;
  wrongAnswer3: string;
  sliderOrder: number;
};

export class QuestionSlide extends HTMLElement {
  question: string = "";
  correctAnswer: string = "";
  wrongAnswer1: string = "";
  wrongAnswer2: string = "";
  wrongAnswer3: string = "";
  isFirstSlide = false;
  root: ShadowRoot | null = null;

  constructor() {
    super();
  }

  connectedCallback() {
    // Ref the template, clone content and attach to root
    const template = document.getElementById(
      "question-slide"
    ) as HTMLTemplateElement;

    const templateContent = template.content;

    const clonedContent = templateContent.cloneNode(true) as DocumentFragment;

    this.root = this.attachShadow({ mode: "closed" });

    // Get and set question and button elements
    const question = clonedContent.querySelector(".question") as HTMLElement;
    question.textContent = this.question;

    const buttons = Array.from(clonedContent.querySelectorAll("button")) as [
      HTMLButtonElement,
      HTMLButtonElement,
      HTMLButtonElement,
      HTMLButtonElement
    ];

    // Put strings in array, randomize them and set to buttons

    const answers: string[] = [
      this.correctAnswer,
      this.wrongAnswer1,
      this.wrongAnswer2,
      this.wrongAnswer3,
    ];

    const randomizedAnswers = this.shuffle(answers) as [
      string,
      string,
      string,
      string
    ];

    buttons[0].textContent = randomizedAnswers[0];
    buttons[1].textContent = randomizedAnswers[1];
    buttons[2].textContent = randomizedAnswers[2];
    buttons[3].textContent = randomizedAnswers[3];

    const buttonsArray = [buttons[0], buttons[1], buttons[2], buttons[3]];

    // Attach onButtonClick hander to the buttons
    buttonsArray.forEach((button) => {
      button.addEventListener("click", this.onButtonClick);
    });

    // Ref buttons and create event for slider navigation

    this.root.appendChild(clonedContent);
  }

  disconnectedCallback() {}

  setData = (questionSlideData: QuestionSlideData) => {
    this.correctAnswer = questionSlideData.correctAnswer;
    this.wrongAnswer1 = questionSlideData.wrongAnswer1;
    this.wrongAnswer2 = questionSlideData.wrongAnswer2;
    this.wrongAnswer3 = questionSlideData.wrongAnswer3;
    this.question = questionSlideData.question;
  };

  onWrongAnswer = () => {
    this.dispatchEvent(
      new CustomEvent("wrongAnswer", { bubbles: true, composed: true })
    );
  };

  onCorrectAnswer = () => {
    this.dispatchEvent(
      new CustomEvent("correctAnswer", { bubbles: true, composed: true })
    );
  };

  onButtonClick = (e: Event) => {
    const button = e.currentTarget as HTMLButtonElement
    const answer = button.textContent
    const isCorrect = this.checkAnswer(answer)
    console.log(isCorrect)

  };

  checkAnswer = (answer: string) => this.correctAnswer === answer;

  shuffle = (array: string[]) => array.sort(() => Math.random() - 0.5);
}

customElements.define("question-slide", QuestionSlide);
