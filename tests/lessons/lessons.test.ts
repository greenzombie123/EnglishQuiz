import { beforeEach, describe, expect, Mock, test, vi } from "vitest";
import { pool } from "../../config/database.config.ts";
import { createIntroSlideQueryString, createQuestionSlideQueryString, IntroSlide, Lesson, LessonData, LessonSlideData, QuestionSlide } from "../../features/lessons/lessons.model.ts";
import { joke } from "../../pop.ts";
import { Pool } from "pg";

describe("LessonSlideData", () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    test("postLessonSlideData adds a record to the Lessons_Introslides table", async () => {
        //const mockLessonDataSlides: LessonSlideData[] = [{ lessonId: 3, slideId: 5 }]

        const spy = vi.spyOn(pool, "query")
        spy.mockImplementation(vi.fn())

        await LessonSlideData.post(2, [2, 3, 10], "intro")

        expect(spy).toBeCalledWith(`INSERT INTO lessons_introslides (lessonid, introslideid) VALUES (2, 2), (2, 3), (2, 10)`)
    })

    test("postLessonSlideData adds a record to the Lessons_Questionslides table", async () => {

        const spy = vi.spyOn(pool, "query")
        spy.mockImplementation(vi.fn())

        await LessonSlideData.post(2, [2, 3, 10], "question")

        expect(spy).toBeCalledWith(`INSERT INTO lessons_questionslides (lessonid, questionslideid) VALUES (2, 2), (2, 3), (2, 10)`)
    })

})

describe("QuestionSlides", () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    test("QuestionSlide.postQuestionSlides inserts question slides into database and return an array of id numbers", async () => {

        const mockIds = [2, 4]

        const spy = vi.spyOn(pool, "query") as Mock
        spy.mockResolvedValue({ rows: [{ id: mockIds[0] }, { id: mockIds[1] }] })

        const mockQuestionSlides: QuestionSlide[] = [
            { question: "Why?", correctanswer: "I dont know!", wronganswer1: "a", wronganswer2: "b", wronganswer3: "c", soundurl: "abc", slidetype: "question", slideorder: 2 },
            { question: "Where", correctanswer: "I dont know!", wronganswer1: "a", wronganswer2: "b", wronganswer3: "c", soundurl: "abc", slidetype: "question", slideorder: 2 }

        ]

        const queryString = createQuestionSlideQueryString(mockQuestionSlides)

        const ids = await QuestionSlide.postQuestionSlides(mockQuestionSlides)

        expect(spy).toBeCalledWith(queryString)
        expect(ids).toStrictEqual(mockIds)
    })
})

describe("IntroSlides", () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    test("QuestionSlide.postQuestionSlides inserts question slides into database and return an array of id numbers", async () => {

        const mockIds = [2, 4]

        const spy = vi.spyOn(pool, "query") as Mock
        spy.mockResolvedValue({ rows: [{ id: mockIds[0] }, { id: mockIds[1] }] })

        const mockIntroSlides: IntroSlide[] = [
            { targetword: "bob", definition: "123", soundurl: "abc", slidetype: "question", slideorder: 2 },
            { targetword: "wow", definition: "123", soundurl: "abc", slidetype: "question", slideorder: 2 }

        ]

        const queryString = createIntroSlideQueryString(mockIntroSlides)

        const ids = await IntroSlide.postIntroSlides(mockIntroSlides)

        expect(spy).toBeCalledWith(queryString)
        expect(ids).toStrictEqual(mockIds)
    })

    test("delete removes a row from questionslides table", async () => {
        
        const spy = vi.spyOn(pool, "query").mockImplementation(vi.fn())

        const mockIds = [10, 20, 4]

        await QuestionSlide.delete(mockIds, pool)

        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledWith(`DELETE FROM questionslides WHERE id in (10,20,4)`)
    })
})

describe("Lessons", () => {

    beforeEach(() => {
        vi.restoreAllMocks()
    })


    test("IntroSlide.getIntroSlides gets an array of slides from database", async () => {

        const introSlide1: IntroSlide = { definition: "f", targetword: "g", slideorder: 1, slidetype: "intro", soundurl: "abc" }
        const introSlide2: IntroSlide = { definition: "a", targetword: "b", slideorder: 1, slidetype: "intro", soundurl: "abc" }

        const spy = (vi.spyOn(pool, "query") as Mock).mockReturnValueOnce({ rows: [introSlide1, introSlide2] })

        const slides = await IntroSlide.getIntroSlides(1)

        expect(slides).toStrictEqual([introSlide1, introSlide2])
    })

    test("IntroSlide.getIntroSlides returns an empty array", async () => {

        const spy = (vi.spyOn(pool, "query") as Mock).mockReturnValueOnce({ rows: [] })

        const slides = await IntroSlide.getIntroSlides(1)

        expect(slides).toStrictEqual([])
    })

    test("QuestionSlide.getQuestionSlides gets an array of slides from database", async () => {

        const questionSlide1: QuestionSlide = { question: "a", correctanswer: "a", wronganswer1: "b", wronganswer2: "c", wronganswer3: "d", slideorder: 3, slidetype: "question", soundurl: "999" }
        const questionSlide2: QuestionSlide = { ...questionSlide1 }

        const spy = (vi.spyOn(pool, "query") as Mock).mockReturnValueOnce({ rows: [questionSlide1, questionSlide2] })

        const slides = await QuestionSlide.getQuestionSlides(1)

        expect(slides).toStrictEqual([questionSlide1, questionSlide2])
    })

    test("Lesson.doesLessonExist", async () => {
        const spy = (vi.spyOn(pool, "query") as Mock).mockResolvedValueOnce({ rows: [{ username: "fefe" }] })

        const teacherIsThere = await Lesson.doesLessonExist("fefe")

        expect(spy).toHaveBeenCalledWith("SELECT name, groupname FROM lessons WHERE id=$1", ["fefe"])
        expect(teacherIsThere).toBe(true)
    })

    test("Lesson.getLessonsByTeacher", async () => {
        const spy = (vi.spyOn(pool, "query") as Mock).mockResolvedValueOnce({ rows: [{ name: "fefe", groupname: "pop" }] })

        const lessons = await Lesson.getLessonsDataByTeacher("fefe")

        expect(spy).toHaveBeenCalledWith("SELECT name, groupname FROM lessons WHERE teacherid=$1", ["fefe"])
        expect(lessons).toEqual([{ name: "fefe", groupname: "pop" }])
    })

    test("Lesson.getLessonById", async () => {
        const mockQuestionSlide: QuestionSlide = { question: "fe", correctanswer: "a", wronganswer1: "b", wronganswer2: "c", wronganswer3: "d", slideorder: 1, slidetype: "question", soundurl: "POP" }
        const mockIntroSlide: IntroSlide = { targetword: "apple", definition: "リンゴ", slideorder: 2, slidetype: "intro", soundurl: "POP" }
        const mockLessonDataResult = { name: "abc", groupname: "gg", id: 2 }

        const spy = (vi.spyOn(pool, "query") as Mock)
            .mockResolvedValueOnce({ rows: [mockLessonDataResult] })
            .mockResolvedValueOnce({ rows: [mockQuestionSlide] })
            .mockResolvedValueOnce({ rows: [mockIntroSlide] })

        const mockLesson: Lesson = { name: "abc", groupname: "gg", slides: [mockQuestionSlide, mockIntroSlide], id: 2 }

        const lesson = await Lesson.getLessonById(2)

        expect(mockLesson).toStrictEqual(lesson)

    })

    test("Lesson.getAllLessonDataByUserName gets all lesson data for student user", async () => {
        const mockLessonData: LessonData[] = [{ name: "abc", groupname: "bbb", id: 4 }, { name: "PPP", groupname: "bbb", id: 4 }]

        const spy = vi.spyOn(pool, "query") as Mock
        spy.mockResolvedValueOnce({ rows: mockLessonData })

        const lessonData = await Lesson.getAllLessonDataByUserName("ppp", "student")

        expect(spy).toBeCalledWith(`SELECT lessons.name, lessons.id, lessons.groupname FROM lessons
                    INNER JOIN teachers
                    ON lessons.teacherid = teachers.id
                    INNER JOIN teachers_students
                    ON teachers.username = teachers_students.teacherusername
                    WHERE teachers_students.studentusername = $1`, ["ppp"])

        expect(lessonData).toStrictEqual(mockLessonData)
    })

    test("Lesson.getAllLessonDataByUserName gets all lesson data for teacher user", async () => {
        const mockLessonData: LessonData[] = [{ name: "abc", groupname: "bbb", id: 4 }, { name: "PPP", groupname: "bbb", id: 4 }]

        const spy = vi.spyOn(pool, "query") as Mock
        spy.mockResolvedValueOnce({ rows: mockLessonData })

        const lessonData = await Lesson.getAllLessonDataByUserName("ddd", "teacher")

        expect(spy).toBeCalledWith(`SELECT lessons.name, lessons.id, lessons.groupname FROM lessons
                    INNER JOIN teachers
                    ON lessons.teacherid = teachers.id
                    WHERE teachers.username = $1`, ["ddd"])

        expect(lessonData).toStrictEqual(mockLessonData)
    })

    test("Lesson.post sends lesson data to database and return id", async () => {
        const mockIds = [{ id: 12 }, { id: 33 }]

        const spy = vi.spyOn(pool, "query") as Mock
        spy.mockResolvedValue({ rows: mockIds })

        const ids = await Lesson.post("abc", "def", "ttt")

        expect(spy).toBeCalledWith(`INSERT INTO lessons (name, teacherid, groupname) VALUES('abc', 'ttt', 'def') RETURNING id`)
        expect(ids).toStrictEqual([12, 33])
    })
})