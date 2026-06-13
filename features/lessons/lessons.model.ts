import { pool } from "../../config/database.config.ts";
import { Slide } from "./lessons.types.ts";

export type LessonData = Omit<Lesson, "questionSlides" | "introSlides">

export class IntroSlide extends Slide {
    targetword: string;
    definition: string;

    constructor(sliderorder: number, targetword: string, definition: string) {
        super(sliderorder, "intro")
        this.targetword = targetword
        this.definition = definition
    }

    static getIntroSlides = async (lessonId: number) => {
        const { rows } = await pool.query<IntroSlide>(`
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

    static getQuestionSlides = async (lessonId: number) => {
        const { rows } = await pool.query<QuestionSlide>(`
            SELECT 
            question, 
            correctanswer, 
            wronganswer1, 
            wronganswer2,
            wronganswer3,
            slideorder,
            type
            FROM questionslides
            INNER JOIN lessons_questionslides
            ON lessons_questionslides.lessonid = questionslides.id
            WHERE lessons_questionslides.lessonid = $1
            `, [lessonId]);
        return rows.length ? rows : [];
    }
}


export class Lesson {
    name: string
    groupname: string
    questionSlides: QuestionSlide[] = []
    introSlides: IntroSlide[] = []
    id: number

    constructor(name: string, groupname: string, id: number) {
        this.name = name
        this.groupname = groupname
        this.id = id
    }

    static doesLessonExist = async (lessonId: string) => {
        const { rows } = await pool.query<Lesson>(
            "SELECT name, groupname FROM lessons WHERE id=$1",
            [lessonId],
        );

        return rows[0] ? true : false
    }

    static getLessonsDataByTeacher = async (teacherId: string) => {
        const { rows } = await pool.query<LessonData>(
            "SELECT name, groupname FROM lessons WHERE teacherid=$1",
            [teacherId],
        )

        return rows
    }

    static getAllLessonDataByUserName = async (username: string, userType: "teacher" | "student"): Promise<LessonData[]> => {

        let queryString: string

        if (userType === "student") {
            queryString = `SELECT lessons.name, lessons.id, lessons.groupname FROM lessons
                    INNER JOIN teachers
                    ON lessons.teacherid = teachers.id
                    INNER JOIN teachers_students
                    ON teachers.username = teachers_students.teacherusername
                    WHERE teachers_students.studentusername = $1`;
        } else
            queryString = `SELECT lessons.name, lessons.id, lessons.groupname FROM lessons
                    INNER JOIN teachers
                    ON lessons.teacherid = teachers.id
                    WHERE teachers.username = $1`;

        const { rows } = await pool.query<LessonData>(queryString, [username]);

        return rows;
    }

    static getLessonById = async (id: number): Promise<Lesson | undefined> => {
        const { rows: lessonData } = await pool.query<Lesson>(
            "SELECT name, groupname, id FROM lessons WHERE id=$1",
            [id],
        );

        let lesson: Lesson

        if (lessonData[0]) lesson = lessonData[0]
        else return undefined

        const questionSlides = await QuestionSlide.getQuestionSlides(id)
        const introSlides = await IntroSlide.getIntroSlides(id)

        return {
            name: lesson.name,
            groupname: lesson.groupname,
            id: id,
            introSlides: introSlides,
            questionSlides: questionSlides
        }
    }
}