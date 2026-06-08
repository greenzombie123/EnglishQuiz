import { beforeEach, describe, expect, Mock, test, vi } from "vitest";
import { pool } from "../../config/database.config.ts";
import { IntroSlide, Lesson, QuestionSlide } from "../../features/lessons/lessons.model.ts";


describe("Lessons", () => {

    beforeEach(() => {
        vi.restoreAllMocks()
    })


    test("IntroSlide.getIntroSlides gets an array of slides from database", async () => {

        const introSlide1: IntroSlide = { definition: "f", targetword: "g", slideorder: 1, slidetype: "intro" }
        const introSlide2: IntroSlide = { definition: "a", targetword: "b", slideorder: 1, slidetype: "intro" }

        const spy = (vi.spyOn(pool, "query") as Mock).mockReturnValueOnce({ rows: [introSlide1, introSlide2] })

        const slides = await IntroSlide.getIntroSlides("1")

        expect(slides).toStrictEqual([introSlide1, introSlide2])
    })

    test("IntroSlide.getIntroSlides returns an empty array", async () => {

        const spy = (vi.spyOn(pool, "query") as Mock).mockReturnValueOnce({ rows: [] })

        const slides = await IntroSlide.getIntroSlides("1")

        expect(slides).toStrictEqual([])
    })

    test("QuestionSlide.getQuestionSlides gets an array of slides from database", async () => {

        const questionSlide1: QuestionSlide = { question: "a", correctanswer: "a", wronganswer1: "b", wronganswer2: "c", wronganswer3: "d", slideorder: 3, slidetype: "question" }
        const questionSlide2: QuestionSlide = { ...questionSlide1 }

        const spy = (vi.spyOn(pool, "query") as Mock).mockReturnValueOnce({ rows: [questionSlide1, questionSlide2] })

        const slides = await QuestionSlide.getQuestionSlides("1")

        expect(slides).toStrictEqual([questionSlide1, questionSlide2])
    })

    test("Lesson.doesLessonExist", async ()=>{
        const spy = (vi.spyOn(pool, "query") as Mock).mockResolvedValueOnce({rows:[{username:"fefe"}]})

        const teacherIsThere = await Lesson.doesLessonExist("fefe")

        expect(spy).toHaveBeenCalledWith("SELECT name, groupname FROM lessons WHERE id=$1",["fefe"])
        expect(teacherIsThere).toBe(true)
    })

    test("Lesson.getLessonsByTeacher", async ()=>{
        const spy = (vi.spyOn(pool, "query") as Mock).mockResolvedValueOnce({rows:[{name:"fefe", groupname:"pop"}]})

        const lessons = await Lesson.getLessonsByTeacher("fefe")

        expect(spy).toHaveBeenCalledWith("SELECT name, groupname FROM lessons WHERE teacherid=$1",["fefe"])
        expect(lessons).toEqual([{name:"fefe", groupname:"pop"}])
    })
})