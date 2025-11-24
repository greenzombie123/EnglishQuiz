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
    correctAnswer: string;
    wrongAnswer1: string;
    wrongAnswer2: string;
    wrongAnswer3: string;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    setData: (questionSlideData: QuestionSlideData) => void;
}
//# sourceMappingURL=QuestionSlide.d.ts.map