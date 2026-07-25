import { pool } from "../../config/database.config.js";
import { Slide } from "./lessons.types.js";
import { format } from "node-pg-format";
export class IntroSlide extends Slide {
    constructor(sliderorder, targetword, definition, soundurl) {
        super(sliderorder, "intro", soundurl);
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
            type
            FROM introslides
            INNER JOIN lessons_introslides 
            ON lessons_introslides.introslideid = introslides.id
            WHERE lessons_introslides.lessonid = $1
            `, [lessonId]);
        return rows.length ? rows : [];
    }; }
    static { this.post = async (introSlides, client) => {
        let p = client ? client : pool;
        const queryString = createIntroSlideQueryString(introSlides);
        const { rows: ids } = await p.query(queryString);
        return ids.map(id => id.id);
    }; }
    static { this.delete = async (lessonId, client = pool) => {
        let p = client ? client : pool;
        const queryString = format(`DELETE FROM introslides WHERE id in (SELECT introslideid FROM lessons_introslides WHERE lessonid = %L)`, lessonId);
        await p.query(queryString);
    }; }
    static { this.deleteById = async (slideIds, client) => {
        let p = client ? client : pool;
        const queryString = format(`DELETE FROM introslides WHERE id in (%L)`, slideIds);
        return (await p.query(queryString)).rows;
    }; }
}
export class QuestionSlide extends Slide {
    constructor(sliderorder, question, correctanswer, wronganswer1, wronganswer2, wronganswer3, soundurl) {
        super(sliderorder, "question", soundurl);
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
            type
            FROM questionslides
            INNER JOIN lessons_questionslides
            ON lessons_questionslides.questionslideid = questionslides.id
            WHERE lessons_questionslides.lessonid = $1
            `, [lessonId]);
        return rows.length ? rows : [];
    }; }
    static { this.post = async (questionSlides, client) => {
        let p = client ? client : pool;
        const queryString = createQuestionSlideQueryString(questionSlides);
        const { rows: ids } = await p.query(queryString);
        return ids.map(id => id.id);
    }; }
    static { this.delete = async (lessonId, client = pool) => {
        let p = client ? client : pool;
        const queryString = format(`DELETE FROM questionslides WHERE id in (SELECT questionslideid FROM lessons_questionslides WHERE lessonid = %L)`, lessonId);
        await p.query(queryString);
    }; }
    static { this.deleteById = async (slideIds, client) => {
        let p = client ? client : pool;
        const queryString = format(`DELETE FROM introslides WHERE id in (%L)`, slideIds);
        return (await p.query(queryString)).rows;
    }; }
}
export class Lesson {
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
    static { this.getLessonsDataByTeacher = async (teacherId) => {
        const { rows } = await pool.query("SELECT name, groupname FROM lessons WHERE teacherid=$1", [teacherId]);
        return rows;
    }; }
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
                    INNER JOIN teachers
                    ON lessons.teacherid = teachers.id
                    WHERE teachers.username = $1`;
        const { rows } = await pool.query(queryString, [username]);
        return rows;
    }; }
    static { this.getLessonById = async (id) => {
        const { rows: lessonData } = await pool.query("SELECT name, groupname, id FROM lessons WHERE id=$1", [id]);
        let lesson;
        if (lessonData[0])
            lesson = lessonData[0];
        else
            return undefined;
        const questionSlides = await QuestionSlide.get(id);
        const introSlides = await IntroSlide.get(id);
        const sortedSlides = sortSlides([...questionSlides, ...introSlides]);
        return {
            name: lesson.name,
            groupname: lesson.groupname,
            id: id,
            slides: sortedSlides
        };
    }; }
    static { this.getAllGroupNamesByTeacher = async (username) => {
        const { rows } = await pool.query(`select distinct groupname from lessons where groupname <> '' 
                and teacherid = (select id from teachers where username = $1);
            `, [username]);
        if (!rows.length)
            return [];
        return rows.map(row => row.groupname);
    }; }
    static { this.post = async (name, groupname, teacherId, client) => {
        const { rows } = await pool.query(`INSERT INTO lessons (name, teacherid, groupname) VALUES('${name}', '${teacherId}', '${groupname}') RETURNING id`);
        return rows[0] ? rows[0].id : undefined;
    }; }
    static { this.update = async (lessonId, name, groupname, client) => {
        let p = client ? client : pool;
        const queryString = format(`UPDATE lessons SET (name, groupname) = (%L, %L) WHERE id = %L`, name, groupname, lessonId);
        await p.query(queryString);
    }; }
    static { this.delete = async (lessonId, client) => {
    }; }
}
export class LessonSlideData {
    constructor(lessonId, slideId) {
        this.lessonId = lessonId;
        this.slideId = slideId;
    }
    static { this.post = async (lessonid, slideIds, slideType, client) => {
        let p = client ? client : pool;
        const slideTableType = slideType === "intro" ? "lessons_introslides" : "lessons_questionslides";
        const slideIdColumnType = slideType === "intro" ? "introslideid" : "questionslideid";
        const lessonSlideDataArray = slideIds.map(id => [lessonid, id]);
        const queryString = format(`INSERT INTO ${slideTableType} (lessonid, ${slideIdColumnType}) VALUES %L`, lessonSlideDataArray);
        await p.query(queryString);
    }; }
}
// Spread all slide arrays into one and then sorts them by slideorder
const sortSlides = (slides) => {
    return slides.sort((currentSlide, nextSlide) => currentSlide.slideorder - nextSlide.slideorder);
};
// Create a query string to insert introslides
export const createIntroSlideQueryString = (slides) => {
    const introColumns = ["targetword", "definition", "slideorder", "soundurl"];
    const introSlides = slides.map((slide) => [
        slide.targetword,
        slide.definition,
        slide.slideorder,
        slide.soundurl
    ]);
    return format("INSERT INTO introslides (%I) VALUES %L RETURNING id", introColumns, introSlides);
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
    return format("INSERT INTO questionslides (%I) VALUES %L RETURNING id", questionColumns, questionslides);
};
const g = { slides: [], name: "efe", groupname: "fefe", id: 1 };
//# sourceMappingURL=lessons.model.js.map