import { pool } from "../../config/database.config.js";
import { BaseSlide } from "./lessons.types.js";
import { format } from "node-pg-format";
export class IntroSlide extends BaseSlide {
    constructor(sliderorder, targetword, definition, lessonid, id, action) {
        super(sliderorder, lessonid, id, action);
        this.type = "intro";
        this.targetword = targetword;
        this.definition = definition;
    }
    static { this.get = async (lessonId) => {
        const { rows } = await pool.query(`
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
        if (!rows.length)
            return [];
        const action = "update";
        const slides = rows.map(async (row) => {
            const introslideid = row.id;
            const { rows } = await pool.query(`SELECT recordingid FROM introslide_recordings WHERE introslideid = $1`, [introslideid]);
            const recordings = rows.map(row => row.recordingid);
            return { ...row, lessonid: Number(row.lessonid), action, recordings };
        });
        return await Promise.all(slides);
    }; }
    static { this.post = async (introSlide, lessonId, client) => {
        let p = client ? client : pool;
        await p.query(`
            INSERT INTO introslides 
            (targetword, definition, slideorder, lessonid, id)
            VALUES($1, $2, $3, $4, $5)
        `, [introSlide.targetword, introSlide.definition, introSlide.slideorder, lessonId, introSlide.id]);
        if (introSlide.recordings.length) {
            const slideRecordings = introSlide.recordings.map(recording => [introSlide.id, recording]);
            const queryString = format(`INSERT INTO introslide_recordings (introslideid, recordingid) VALUES %L`, slideRecordings);
            await p.query(queryString);
        }
    }; }
    static { this.update = async (introSlide, client) => {
        let p = client ? client : pool;
        await p.query(`
            UPDATE introslides 
                SET 
                    targetword = $1,
                    definition = $2,
                    slideorder = $3
                WHERE id = $4
        `, [introSlide.targetword, introSlide.definition, introSlide.slideorder, introSlide.id]);
        await p.query(`DELETE FROM introslide_recordings WHERE introslideid = $1`, [introSlide.id]);
        if (introSlide.recordings.length) {
            const slideRecordings = introSlide.recordings.map(recording => [introSlide.id, recording]);
            const queryString = format(`INSERT INTO introslide_recordings (introslideid, recordingid) VALUES %L`, slideRecordings);
            await p.query(queryString);
        }
    }; }
    static { this.deleteAll = async (lessonId, client) => {
        let p = client ? client : pool;
        const queryString = format(`DELETE FROM introslides WHERE lessonid = %L`, lessonId);
        await p.query(queryString);
    }; }
    static { this.deleteById = async (id, client) => {
        let p = client ? client : pool;
        const queryString = format(`DELETE FROM introslides WHERE id = %L`, id);
        await p.query(queryString);
    }; }
}
export class QuestionSlide extends BaseSlide {
    constructor(sliderorder, question, correctanswer, wronganswer1, wronganswer2, wronganswer3, lessonid, id, action) {
        super(sliderorder, lessonid, id, action);
        this.type = "question";
        this.question = question;
        this.correctanswer = correctanswer;
        this.wronganswer1 = wronganswer1;
        this.wronganswer2 = wronganswer2;
        this.wronganswer3 = wronganswer3;
    }
    static { this.get = async (lessonId) => {
        const { rows } = await pool.query(`
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
        if (!rows.length)
            return [];
        const action = "update";
        const slides = rows.map(async (row) => {
            const questionslideid = row.id;
            const { rows } = await pool.query(`SELECT recordingid FROM questionslide_recordings WHERE questionslideid = $1`, [questionslideid]);
            const recordings = rows.map(row => row.recordingid);
            return { ...row, lessonid: Number(row.lessonid), action, recordings };
        });
        return await Promise.all(slides);
    }; }
    // static post = async (questionSlides: QuestionSlide[], client?: PoolClient): Promise<number[]> => {
    //     let p = client ? client : pool
    //     const queryString = createQuestionSlideQueryString(questionSlides)
    //     const { rows: ids } = await p.query<{ id: number }>(queryString)
    //     return ids.map(id => id.id)
    // }
    static { this.post = async (questionSlide, lessonId, client) => {
        let p = client ? client : pool;
        await p.query(`
            INSERT INTO questionslides 
            (question, correctanswer, wronganswer1, wronganswer2, wronganswer3, slideorder, lessonid, id)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
            questionSlide.question,
            questionSlide.correctanswer,
            questionSlide.wronganswer1,
            questionSlide.wronganswer2,
            questionSlide.wronganswer3,
            questionSlide.slideorder,
            lessonId,
            questionSlide.id
        ]);
        if (questionSlide.recordings.length) {
            const slideRecordings = questionSlide.recordings.map(recording => [questionSlide.id, recording]);
            const queryString = format(`INSERT INTO questionslide_recordings (questionslideid, recordingid) VALUES %L`, slideRecordings);
            await p.query(queryString);
        }
    }; }
    static { this.update = async (questionSlide, client) => {
        let p = client ? client : pool;
        await p.query(`
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
        ]);
        await p.query(`DELETE FROM questionslide_recordings WHERE questionslideid = $1`, [questionSlide.id]);
        if (questionSlide.recordings.length) {
            const slideRecordings = questionSlide.recordings.map(recording => [questionSlide.id, recording]);
            const queryString = format(`INSERT INTO questionslide_recordings (questionslideid, recordingid) VALUES %L`, slideRecordings);
            await p.query(queryString);
        }
    }; }
    static { this.deleteAll = async (lessonId, client) => {
        let p = client ? client : pool;
        const queryString = format(`DELETE FROM questionslides WHERE lessonid = %L`, lessonId);
        await p.query(queryString);
    }; }
    static { this.deleteById = async (id, client) => {
        let p = client ? client : pool;
        const queryString = format(`DELETE FROM questionslides WHERE id = %L`, id);
        await p.query(queryString);
    }; }
}
export class Lesson {
    // classid:number
    constructor(name, groupname, id) {
        this.id = undefined;
        this.slides = [];
        this.name = name;
        this.groupname = groupname;
        this.id = id;
    }
    static { this.doesLessonExist = async (lessonId) => {
        const { rows } = await pool.query("SELECT name, groupname FROM lessons WHERE id=$1", [lessonId]);
        return rows[0] ? true : false;
    }; }
    //TODO change to getLessonsDataByClass
    // static getLessonsDataByTeacher = async (teacherId: string) => {
    //     const { rows } = await pool.query<LessonData>(
    //         "SELECT name, groupname FROM lessons WHERE teacherid=$1",
    //         [teacherId],
    //     )
    //     return rows
    // }
    //TODO Change students later
    static { this.getAllLessonDataByUserName = async (username, userType) => {
        let queryString;
        if (userType === "student") {
            queryString = `SELECT lessons.name, lessons.id, lessons.groupname FROM lessons
                    INNER JOIN teachers
                    ON lessons.teacherid = teachers.id
                    INNER JOIN teachers_students
                    ON teachers.username = teachers_students.teacherusername
                    WHERE teachers_students.studentusername = $1`;
        }
        else
            queryString = `SELECT lessons.name, lessons.id, lessons.groupname FROM lessons
                    INNER JOIN classes
                    ON lessons.classid = classes.id 
                    INNER JOIN teachers
                    on teachers.id = classes.teacherid
                    WHERE teachers.username = $1
                    `;
        const { rows } = await pool.query(queryString, [username]);
        return rows;
    }; }
    static { this.getLessonById = async (id) => {
        const { rows: lessonData } = await pool.query("SELECT name, groupname, id FROM lessons WHERE id=$1", [id]);
        let lesson;
        if (!lessonData[0])
            return undefined;
        lesson = lessonData[0];
        const questionSlides = await QuestionSlide.get(id);
        const introSlides = await IntroSlide.get(id);
        const sortedSlides = sortSlides([...questionSlides, ...introSlides]);
        return {
            name: lesson.name,
            groupname: lesson.groupname,
            id: id,
            slides: sortedSlides,
        };
    }; }
    static { this.getAllGroupNamesByTeacher = async (username) => {
        const { rows } = await pool.query(`select distinct groupname from lessons where groupname <> '' 
                and classid = (select classes.id from classes 
                    join teachers
                    on teachers.id = classes.teacherid
                    where teachers.username = $1);
            `, [username]);
        if (!rows.length)
            return [];
        return rows.map(row => row.groupname);
    }; }
    static { this.post = async (name, groupname, classId, client) => {
        let p = client ? client : pool;
        const { rows } = await p.query(`INSERT INTO lessons (name, classid, groupname) VALUES('${name}', '${classId}', '${groupname}') RETURNING id`);
        if (!rows[0])
            throw new Error(`Couldn't create lesson because ${rows}`);
        return rows[0].id;
    }; }
    static { this.update = async (lessonId, name, groupname, client) => {
        let p = client ? client : pool;
        const queryString = format(`UPDATE lessons SET (name, groupname) = (%L, %L) WHERE id = %L`, name, groupname, lessonId);
        await p.query(queryString);
    }; }
    // static getSoundUrls = async (lessonId: number) => {
    //     const introSlideSoundUrls = await IntroSlide.getSoundUrls(lessonId)
    //     const questionSlideSoundUrls = await QuestionSlide.getSoundUrls(lessonId)
    //     const soundurls = [...introSlideSoundUrls, ...questionSlideSoundUrls].filter(soundUrl => soundUrl)
    //     // Remove duplicates
    //     return [...new Set(soundurls)]
    // }
    static { this.delete = async (lessonId) => {
        const queryString = format("DELETE FROM lessons WHERE id = %L", lessonId);
        await pool.query(queryString);
    }; }
    static { this.getSlideIdsByLessonId = async (lessonId, client) => {
        let p = client ? client : pool;
        const { rows: introRows } = await pool.query(`SELECT id, type FROM introslides WHERE lessonid = $1`, [lessonId]);
        const { rows: questionRows } = await pool.query(`SELECT id, type FROM questionslides WHERE lessonid = $1`, [lessonId]);
        const rows = [...introRows, ...questionRows];
        let ids;
        ids = rows.map(row => [row.id, row.type]);
        return ids;
    }; }
}
// Spread all slide arrays into one and then sorts them by slideorder
const sortSlides = (slides) => {
    return slides.sort((currentSlide, nextSlide) => currentSlide.slideorder - nextSlide.slideorder);
};
// Create a query string to insert introslides
export const createIntroSlideQueryString = (slides) => {
    const introColumns = ["targetword", "definition", "slideorder", "lessonid"];
    const introSlides = slides.map((slide) => [
        slide.targetword,
        slide.definition,
        slide.slideorder,
        slide.lessonid
    ]);
    return format("INSERT INTO introslides (%I) VALUES %L", introColumns, introSlides);
};
// Create a query string to insert questionslides
export const createQuestionSlideQueryString = (slides) => {
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
    return format("INSERT INTO questionslides (%I) VALUES %L", questionColumns, questionslides);
};
//# sourceMappingURL=lessons.model.js.map