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
export declare class QuestionSlide extends HTMLElement {
    question: string;
    correctAnswer: string;
    wrongAnswer1: string;
    wrongAnswer2: string;
    wrongAnswer3: string;
    isFirstSlide: boolean;
    root: ShadowRoot | null;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    setData: (questionSlideData: QuestionSlideData) => void;
    onWrongAnswer: () => void;
    onCorrectAnswer: () => void;
    onButtonClick: (e: Event) => void;
    checkAnswer: (answer: string) => boolean;
    shuffle: (array: string[]) => string[];
}
//# sourceMappingURL=QuestionSlide.d.ts.map