import { pool } from "../../config/database.config.ts";
import { Slide } from "./lessons.types.ts";

export class IntroSlide extends Slide {
    targetword: string;
    definition: string;

    constructor(sliderorder: number, targetword: string, definition: string) {
        super(sliderorder, "intro")
        this.targetword = targetword
        this.definition = definition
    }

    static getIntroSlides = async (lessonId: string) => {
        const { rows } = await pool.query<IntroSlide[]>(`
            SELECT 
            targetword, 
            definition,
            slideorder,
            type
            FROM introslides
            INNER JOIN lessons_introslides 
            ON lessons_introslides.introslideid = introslides.id
            WHERE lessons_introslides.lessonid = $1
            `, [lessonId]);
        return rows.length ? rows : [];
    }
}

export class QuestionSlide extends Slide {
    question: string;
    correctanswer: string;
    wronganswer1: string;
    wronganswer2: string;
    wronganswer3: string;

    constructor(sliderorder: number, question: string,
        correctanswer: string,
        wronganswer1: string,
        wronganswer2: string,
        wronganswer3: string) {
        super(sliderorder, "question")
        this.question = question
        this.correctanswer = correctanswer
        this.wronganswer1 = wronganswer1
        this.wronganswer2 = wronganswer2
        this.wronganswer3 = wronganswer3
    }

    static getQuestionSlides = async (lessonId: string) => {

    }
}