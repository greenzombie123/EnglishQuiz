import type { Pool, PoolClient } from "pg";
import { pool } from "../../config/database.config.ts";
import { Slide, type SlideType } from "./lessons.types.ts";
import { format } from "node-pg-format";

export type LessonData = Omit<Lesson, "slides">

export type LessonToSlideData = {
    lessonId: number;
    slideId: number;
}

export type IntroSlideData = InstanceType<typeof IntroSlide>

export type SlideData = IntroSlideData | QuestionSlideData

export class IntroSlide extends Slide {
    targetword: string;
    definition: string;
    type: "intro" = "intro"

    constructor(sliderorder: number, targetword: string, definition: string, soundurl: string) {
        super(sliderorder, "intro", soundurl)
        this.targetword = targetword
        this.definition = definition
    }

    static get = async (lessonId: number) => {
        const { rows } = await pool.query<IntroSlideData>(`
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

    static post = async (introSlides: IntroSlide[], client?: PoolClient): Promise<number[]> => {
        let p = client ? client : pool

        const queryString = createIntroSlideQueryString(introSlides)

        const { rows: ids } = await p.query<{ id: number }>(queryString)

        return ids.map(id => id.id)
    }

    static delete = async (lessonId: number, client: Pool | PoolClient = pool) => {
        let p = client ? client : pool

        const queryString = format(`DELETE FROM introslides WHERE id in (SELECT introslideid FROM lessons_introslides WHERE lessonid = %L)`, lessonId)

        await p.query(queryString)
    }

    static deleteById = async (slideIds:number[], client:Pool):Promise<IntroSlideData[]> => {
         let p = client ? client : pool

         const queryString = format(`DELETE FROM introslides WHERE id in (%L)`, slideIds)

         return (await p.query<IntroSlideData>(queryString)).rows
    }
}

export type QuestionSlideData = InstanceType<typeof QuestionSlide>

export class QuestionSlide extends Slide {
    question: string;
    correctanswer: string;
    wronganswer1: string;
    wronganswer2: string;
    wronganswer3: string;
    type: "question" = "question"

    constructor(sliderorder: number, question: string,
        correctanswer: string,
        wronganswer1: string,
        wronganswer2: string,
        wronganswer3: string,
        soundurl: string) {
        super(sliderorder, "question", soundurl)
        this.question = question
        this.correctanswer = correctanswer
        this.wronganswer1 = wronganswer1
        this.wronganswer2 = wronganswer2
        this.wronganswer3 = wronganswer3
    }

    static get = async (lessonId: number) => {
        const { rows } = await pool.query<QuestionSlideData>(`
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
            ON lessons_questionslides.questionslideid = questionslides.id
            WHERE lessons_questionslides.lessonid = $1
            `, [lessonId]);
        return rows.length ? rows : [];
    }

    static post = async (questionSlides: QuestionSlide[], client?: PoolClient): Promise<number[]> => {

        let p = client ? client : pool

        const queryString = createQuestionSlideQueryString(questionSlides)
        const { rows: ids } = await p.query<{ id: number }>(queryString)

        return ids.map(id => id.id)
    }

    static delete = async (lessonId: number, client: Pool | PoolClient = pool) => {
        let p = client ? client : pool

        const queryString = format(`DELETE FROM questionslides WHERE id in (SELECT questionslideid FROM lessons_questionslides WHERE lessonid = %L)`, lessonId)

        await p.query(queryString)
    }

    static deleteById = async (slideIds:number[], client:Pool):Promise<QuestionSlideData[]> => {
         let p = client ? client : pool

         const queryString = format(`DELETE FROM introslides WHERE id in (%L)`, slideIds)

         return (await p.query<QuestionSlideData>(queryString)).rows
    }
}


export class Lesson {
    name: string
    groupname: string
    id: number | undefined = undefined
    slides: SlideData[] = []

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

        const questionSlides = await QuestionSlide.get(id)
        const introSlides = await IntroSlide.get(id)
        const sortedSlides = sortSlides([...questionSlides, ...introSlides])

        return {
            name: lesson.name,
            groupname: lesson.groupname,
            id: id,
            slides: sortedSlides
        }
    }

    static getAllGroupNamesByTeacher = async (username: string): Promise<string[]> => {
        const { rows } = await pool.query<{ groupname: string }>(
            `select distinct groupname from lessons where groupname <> '' 
                and teacherid = (select id from teachers where username = $1);
            `, [username]
        )

        if(!rows.length) return []

        return rows.map(row=>row.groupname)
    }

    static post = async (name: string, groupname: string, teacherId: string, client?: PoolClient): Promise<number | undefined> => {

        const { rows } = await pool.query<{ id: number }>(`INSERT INTO lessons (name, teacherid, groupname) VALUES('${name}', '${teacherId}', '${groupname}') RETURNING id`)

        return rows[0] ? rows[0].id : undefined
    }

    static update = async(lessonId:number, name: string, groupname: string, client?: PoolClient)=>{

        let p = client ? client : pool
        
        const queryString = format(`UPDATE lessons SET (name, groupname) = (%L, %L) WHERE id = %L`, name, groupname, lessonId)

        await p.query(queryString)
    }

    static delete = async (lessonId: number, client?: PoolClient) => {

    }
}

export class LessonSlideData {
    lessonId: number;
    slideId: number;

    constructor(lessonId: number, slideId: number) {
        this.lessonId = lessonId
        this.slideId = slideId
    }

    static post = async (lessonid: number, slideIds: number[], slideType: SlideType, client?: PoolClient) => {

        let p = client ? client : pool

        const slideTableType = slideType === "intro" ? "lessons_introslides" : "lessons_questionslides"
        const slideIdColumnType = slideType === "intro" ? "introslideid" : "questionslideid"

        const lessonSlideDataArray: [number, number][] = slideIds.map(id => [lessonid, id])

        const queryString = format(`INSERT INTO ${slideTableType} (lessonid, ${slideIdColumnType}) VALUES %L`, lessonSlideDataArray)
        await p.query(queryString)
    }
}

// Spread all slide arrays into one and then sorts them by slideorder
const sortSlides = (slides: SlideData[]) => {
    return slides.sort(
        (currentSlide, nextSlide) => currentSlide.slideorder - nextSlide.slideorder,
    );
};

// Create a query string to insert introslides

export const createIntroSlideQueryString = (slides: IntroSlide[]) => {

    const introColumns = ["targetword", "definition", "slideorder", "soundurl"]

    const introSlides = slides.map((slide) => [
        slide.targetword,
        slide.definition,
        slide.slideorder,
        slide.soundurl
    ]);

    return format(
        "INSERT INTO introslides (%I) VALUES %L RETURNING id",
        introColumns,
        introSlides
    );
};

// Create a query string to insert questionslides

export const createQuestionSlideQueryString = (slides: QuestionSlide[]) => {

    const questionslides = slides.map((slide) => [
        slide.question,
        slide.correctanswer,
        slide.wronganswer1,
        slide.wronganswer2,
        slide.wronganswer3,
        slide.slideorder,
        slide.soundurl
    ]);

    const questionColumns = [
        "question",
        "correctanswer",
        "wronganswer1",
        "wronganswer2",
        "wronganswer3",
        "slideorder",
        "soundurl"
    ];

    return format(
        "INSERT INTO questionslides (%I) VALUES %L RETURNING id",
        questionColumns,
        questionslides
    );
};