import { beforeEach, describe, expect, Mock, test, vi } from "vitest";
import { pool } from "../../config/database.config.ts";
import { IntroSlide } from "../../features/lessons/lessons.model.ts";

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
})