import type { Pool, PoolClient } from "pg";
import { pool } from "../../config/database.config.ts";
import { BaseSlide, type SlideType, type DatabaseAction } from "./lessons.types.ts";
import { format } from "node-pg-format";

export type LessonData = Omit<Lesson, "slides">

export type LessonSlide = QuestionSlide | IntroSlide

export class IntroSlide extends BaseSlide {
    targetword: string;
    definition: string;
    type: "intro" = "intro"

    constructor(sliderorder: number, targetword: string, definition: string, lessonid: number, id: string, action: DatabaseAction) {
        super(sliderorder, lessonid, id, action)
        this.targetword = targetword
        this.definition = definition
    }

    static get = async (lessonId: number): Promise<IntroSlide[]> => {
        const { rows } = await pool.query<Omit<IntroSlide, "recordings">>(`
            SELECT 
            targetword, 
            definition,
            slideorder,
            type,
            lessonid,
            id
            FROM introslides
            WHERE lessonid = $1
            `, [lessonId]);

        if (!rows.length) return []

        const action: DatabaseAction = "update"

        const slides: Promise<IntroSlide>[] = rows.map(async (row) => {
            const introslideid = row.id
            const { rows } = await pool.query<{ recordingid: string }>(`SELECT recordingid FROM introslide_recordings WHERE introslideid = $1`, [introslideid])
            const recordings = rows.map(row => row.recordingid)

            return { ...row, lessonid: Number(row.lessonid), action, recordings }
        })

        return await Promise.all(slides)
    }

    static post = async (introSlide: IntroSlide, lessonId: number, client?: PoolClient) => {
        let p = client ? client : pool

        await p.query(`
            INSERT INTO introslides 
            (targetword, definition, slideorder, lessonid, id)
            VALUES($1, $2, $3, $4, $5)
        `, [introSlide.targetword, introSlide.definition, introSlide.slideorder, lessonId, introSlide.id])


        if (introSlide.recordings.length) {

            const slideRecordings = introSlide.recordings.map(recording => [introSlide.id, recording])

            const queryString = format(`INSERT INTO introslide_recordings (introslideid, recordingid) VALUES %L`, slideRecordings)

            await p.query(queryString)
        }
    }

    static update = async (introSlide: IntroSlide, client?: PoolClient) => {
        let p = client ? client : pool

        await p.query<{ id: number }>(`
            UPDATE introslides 
                SET 
                    targetword = $1,
                    definition = $2,
                    slideorder = $3
                WHERE id = $4
        `, [introSlide.targetword, introSlide.definition, introSlide.slideorder, introSlide.id])

        await p.query(`DELETE FROM introslide_recordings WHERE introslideid = $1`, [introSlide.id])

        if (introSlide.recordings.length) {


            const slideRecordings = introSlide.recordings.map(recording => [introSlide.id, recording])

            const queryString = format(`INSERT INTO introslide_recordings (introslideid, recordingid) VALUES %L`, slideRecordings)

            await p.query(queryString)
        }
    }

    static deleteAll = async (lessonId: number, client?: PoolClient) => {
        let p = client ? client : pool

        const queryString = format(`DELETE FROM introslides WHERE lessonid = %L`, lessonId)

        await p.query(queryString)
    }

    static deleteById = async (id: string, client?: PoolClient) => {
        let p = client ? client : pool

        const queryString = format(`DELETE FROM introslides WHERE id = %L`, id)

        await p.query<IntroSlide>(queryString)
    }

    // static getSoundUrls = async (lessonId: number) => {
    //     const { rows } = await pool.query<IntroSlide>(`
    //         SELECT 
    //         soundurl
    //         FROM introslides
    //         WHERE lessonid = $1
    //         `, [lessonId]);

    //     return rows.map(row => row.soundurl)
    // }
}

export class QuestionSlide extends BaseSlide {
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
        lessonid: number,
        id: string,
        action: DatabaseAction
    ) {
        super(sliderorder, lessonid, id, action)
        this.question = question
        this.correctanswer = correctanswer
        this.wronganswer1 = wronganswer1
        this.wronganswer2 = wronganswer2
        this.wronganswer3 = wronganswer3
    }

    static get = async (lessonId: number): Promise<QuestionSlide[]> => {
        const { rows } = await pool.query<QuestionSlide>(`
            SELECT 
            question, 
            correctanswer, 
            wronganswer1, 
            wronganswer2,
            wronganswer3,
            slideorder,
            type,
            lessonid,
            id
            FROM questionslides
            WHERE lessonid = $1
            `, [lessonId]);

        if (!rows.length) return []

        const action: DatabaseAction = "update"

        const slides: Promise<QuestionSlide>[] = rows.map(async (row) => {
            const questionslideid = row.id
            const { rows } = await pool.query<{ recordingid: string }>(`SELECT recordingid FROM questionslide_recordings WHERE questionslideid = $1`, [questionslideid])
            const recordings = rows.map(row => row.recordingid)

            return { ...row, lessonid: Number(row.lessonid), action, recordings }
        })

        return await Promise.all(slides)
    }

    // static post = async (questionSlides: QuestionSlide[], client?: PoolClient): Promise<number[]> => {

    //     let p = client ? client : pool

    //     const queryString = createQuestionSlideQueryString(questionSlides)
    //     const { rows: ids } = await p.query<{ id: number }>(queryString)

    //     return ids.map(id => id.id)
    // }

    static post = async (questionSlide: QuestionSlide, lessonId: number, client?: PoolClient) => {
        let p = client ? client : pool

        await p.query<{ id: number }>(`
            INSERT INTO questionslides 
            (question, correctanswer, wronganswer1, wronganswer2, wronganswer3, slideorder, lessonid, id)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        `,
            [
                questionSlide.question,
                questionSlide.correctanswer,
                questionSlide.wronganswer1,
                questionSlide.wronganswer2,
                questionSlide.wronganswer3,
                questionSlide.slideorder,
                lessonId,
                questionSlide.id
            ])

        if (questionSlide.recordings.length) {
            const slideRecordings = questionSlide.recordings.map(recording => [questionSlide.id, recording])

            const queryString = format(`INSERT INTO questionslide_recordings (questionslideid, recordingid) VALUES %L`, slideRecordings)

            await p.query(queryString)
        }
    }

    static update = async (questionSlide: QuestionSlide, client?: PoolClient) => {
        let p = client ? client : pool

        await p.query<{ id: number }>(`
            UPDATE questionslides 
                SET 
                    question = $1,
                    correctanswer = $2,
                    wronganswer1 = $3,
                    wronganswer2 = $4,
                    wronganswer3 = $5,
                    slideorder = $6
                WHERE id = $7
        `, [
            questionSlide.question,
            questionSlide.correctanswer,
            questionSlide.wronganswer1,
            questionSlide.wronganswer2,
            questionSlide.wronganswer3,
            questionSlide.slideorder,
            questionSlide.id
        ])

         await p.query(`DELETE FROM questionslide_recordings WHERE questionslideid = $1`, [questionSlide.id])

        if (questionSlide.recordings.length) {

            const slideRecordings = questionSlide.recordings.map(recording => [questionSlide.id, recording])

            const queryString = format(`INSERT INTO questionslide_recordings (questionslideid, recordingid) VALUES %L`, slideRecordings)

            await p.query(queryString)
        }
    }

    static deleteAll = async (lessonId: number, client?: PoolClient) => {
        let p = client ? client : pool

        const queryString = format(`DELETE FROM questionslides WHERE lessonid = %L`, lessonId)

        await p.query(queryString)
    }

    static deleteById = async (id: string, client?: PoolClient) => {
        let p = client ? client : pool

        const queryString = format(`DELETE FROM questionslides WHERE id = %L`, id)

        await p.query<QuestionSlide>(queryString)
    }

    // static getSoundUrls = async (lessonId: number) => {
    //     const { rows } = await pool.query<QuestionSlideData>(`
    //         SELECT 
    //         soundurl
    //         FROM questionslides
    //         WHERE lessonid = $1
    //         `, [lessonId]);

    //     return rows.map(row => row.soundurl)
    // }
}


export class Lesson {
    name: string
    groupname: string
    id: number | undefined = undefined
    slides: LessonSlide[] = []
    // classid:number

    constructor(name: string, groupname: string, id: number) {
        this.name = name
        this.groupname = groupname
        this.id = id
    }

    static doesLessonExist = async (lessonId: string) => {
        const { rows } = await pool.query<LessonData>(
            "SELECT name, groupname FROM lessons WHERE id=$1",
            [lessonId],
        );

        return rows[0] ? true : false
    }

    //TODO change to getLessonsDataByClass
    // static getLessonsDataByTeacher = async (teacherId: string) => {
    //     const { rows } = await pool.query<LessonData>(
    //         "SELECT name, groupname FROM lessons WHERE teacherid=$1",
    //         [teacherId],
    //     )

    //     return rows
    // }

    //TODO Change students later
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
                    INNER JOIN classes
                    ON lessons.classid = classes.id 
                    INNER JOIN teachers
                    on teachers.id = classes.teacherid
                    WHERE teachers.username = $1
                    `;

        const { rows } = await pool.query<LessonData>(queryString, [username]);

        return rows;
    }

    static getLessonById = async (id: number): Promise<Lesson | undefined> => {
        const { rows: lessonData } = await pool.query<Lesson>(
            "SELECT name, groupname, id FROM lessons WHERE id=$1",
            [id],
        );

        let lesson: Lesson

        if (!lessonData[0]) return undefined
        lesson = lessonData[0]

        const questionSlides = await QuestionSlide.get(id)
        const introSlides = await IntroSlide.get(id)
        const sortedSlides = sortSlides([...questionSlides, ...introSlides])

        return {
            name: lesson.name,
            groupname: lesson.groupname,
            id: id,
            slides: sortedSlides,
        }
    }

    static getAllGroupNamesByTeacher = async (username: string): Promise<string[]> => {
        const { rows } = await pool.query<{ groupname: string }>(
            `select distinct groupname from lessons where groupname <> '' 
                and classid = (select classes.id from classes 
                    join teachers
                    on teachers.id = classes.teacherid
                    where teachers.username = $1);
            `, [username]
        )

        if (!rows.length) return []

        return rows.map(row => row.groupname)
    }

    static post = async (name: string, groupname: string, classId: number, client?: PoolClient): Promise<number> => {

        let p = client ? client : pool

        const { rows } = await p.query<{ id: number }>(`INSERT INTO lessons (name, classid, groupname) VALUES('${name}', '${classId}', '${groupname}') RETURNING id`)

        if (!rows[0]) throw new Error(`Couldn't create lesson because ${rows}`)

        return rows[0].id
    }

    static update = async (lessonId: number, name: string, groupname: string, client?: PoolClient) => {

        let p = client ? client : pool

        const queryString = format(`UPDATE lessons SET (name, groupname) = (%L, %L) WHERE id = %L`, name, groupname, lessonId)

        await p.query(queryString)
    }

    // static getSoundUrls = async (lessonId: number) => {
    //     const introSlideSoundUrls = await IntroSlide.getSoundUrls(lessonId)
    //     const questionSlideSoundUrls = await QuestionSlide.getSoundUrls(lessonId)

    //     const soundurls = [...introSlideSoundUrls, ...questionSlideSoundUrls].filter(soundUrl => soundUrl)

    //     // Remove duplicates
    //     return [...new Set(soundurls)]
    // }

    static delete = async (lessonId: number | string) => {
        const queryString = format("DELETE FROM lessons WHERE id = %L", lessonId);
        await pool.query(queryString);
    }

    static getSlideIdsByLessonId = async (lessonId: number, client?: PoolClient) => {

        let p = client ? client : pool

        const { rows: introRows } = await pool.query<{ id: number, type: "intro" }>(`SELECT id, type FROM introslides WHERE lessonid = $1`, [lessonId])
        const { rows: questionRows } = await pool.query<{ id: number, type: "question" }>(`SELECT id, type FROM questionslides WHERE lessonid = $1`, [lessonId])

        const rows = [...introRows, ...questionRows]

        let ids: [number, "intro" | "question"][]

        ids = rows.map(row => [row.id, row.type])

        return ids
    }
}

// Spread all slide arrays into one and then sorts them by slideorder

const sortSlides = (slides: LessonSlide[]) => {
    return slides.sort(
        (currentSlide, nextSlide) => currentSlide.slideorder - nextSlide.slideorder,
    );
};

// Create a query string to insert introslides

export const createIntroSlideQueryString = (slides: IntroSlide[]) => {

    const introColumns = ["targetword", "definition", "slideorder", "lessonid"]

    const introSlides = slides.map((slide) => [
        slide.targetword,
        slide.definition,
        slide.slideorder,
        slide.lessonid
    ]);

    return format(
        "INSERT INTO introslides (%I) VALUES %L",
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
        slide.lessonid
    ]);

    const questionColumns = [
        "question",
        "correctanswer",
        "wronganswer1",
        "wronganswer2",
        "wronganswer3",
        "slideorder",
        "lessonid"
    ];

    return format(
        "INSERT INTO questionslides (%I) VALUES %L",
        questionColumns,
        questionslides
    );
};
