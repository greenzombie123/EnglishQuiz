export class QuestionSlide extends HTMLElement {
    constructor() {
        super();
        this.question = "";
        this.correctAnswer = "";
        this.wrongAnswer1 = "";
        this.wrongAnswer2 = "";
        this.wrongAnswer3 = "";
        this.isFirstSlide = false;
        this.root = null;
        this.setData = (questionSlideData) => {
            this.correctAnswer = questionSlideData.correctAnswer;
            this.wrongAnswer1 = questionSlideData.wrongAnswer1;
            this.wrongAnswer2 = questionSlideData.wrongAnswer2;
            this.wrongAnswer3 = questionSlideData.wrongAnswer3;
            this.question = questionSlideData.question;
        };
        this.onWrongAnswer = () => {
            this.dispatchEvent(new CustomEvent("wrongAnswer", { bubbles: true, composed: true }));
        };
        this.onCorrectAnswer = () => {
            this.dispatchEvent(new CustomEvent("correctAnswer", { bubbles: true, composed: true }));
        };
        this.onButtonClick = (e) => {
            const button = e.currentTarget;
            const answer = button.textContent;
            const isCorrect = this.checkAnswer(answer);
            if (isCorrect)
                this.onCorrectAnswer();
            else
                this.onWrongAnswer();
        };
        this.checkAnswer = (answer) => this.correctAnswer === answer;
        this.shuffle = (array) => array.sort(() => Math.random() - 0.5);
    }
    connectedCallback() {
        // Ref the template, clone content and attach to root
        const template = document.getElementById("question-slide");
        const templateContent = template.content;
        const clonedContent = templateContent.cloneNode(true);
        this.root = this.attachShadow({ mode: "closed" });
        // Get and set question and button elements
        const question = clonedContent.querySelector(".question");
        question.textContent = this.question;
        const buttons = Array.from(clonedContent.querySelectorAll("button"));
        // Put strings in array, randomize them and set to buttons
        const answers = [
            this.correctAnswer,
            this.wrongAnswer1,
            this.wrongAnswer2,
            this.wrongAnswer3,
        ];
        const randomizedAnswers = this.shuffle(answers);
        buttons[0].textContent = randomizedAnswers[0];
        buttons[1].textContent = randomizedAnswers[1];
        buttons[2].textContent = randomizedAnswers[2];
        buttons[3].textContent = randomizedAnswers[3];
        const buttonsArray = [buttons[0], buttons[1], buttons[2], buttons[3]];
        // Attach onButtonClick hander to the buttons
        buttonsArray.forEach((button) => {
            // If the button has a text value of "", remove it from the dom.
            if (!button.textContent)
                button.remove();
            else
                button.addEventListener("click", this.onButtonClick);
        });
        // Ref buttons and create event for slider navigation
        this.root.appendChild(clonedContent);
    }
    disconnectedCallback() { }
}
customElements.define("question-slide", QuestionSlide);
//# sourceMappingURL=QuestionSlide.js.map