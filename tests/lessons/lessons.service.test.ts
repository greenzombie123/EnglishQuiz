import { describe, test } from "vitest";
import { postLessonService } from "../../features/lessons/lessons.service.ts";
import { IntroSlide, QuestionSlide } from "../../features/lessons/lessons.model.ts";



test.skip("postLesson inserts records for lessons, slide tables, and lessonslide data tables", async () => {
    const introSlides: IntroSlide[] = [{ targetword: "bob", definition: "123", soundurl: "abc", slidetype: "question", slideorder: 2 }]
    const questionSlides: QuestionSlide[] = [{ question: "Why?", correctanswer: "I dont know!", wronganswer1: "a", wronganswer2: "b", wronganswer3: "c", soundurl: "abc", slidetype: "question", slideorder: 2 }]
    await postLessonService({ name: "abc", groupname: "pop", lessonId: 2, introSlides, questionSlides })


})