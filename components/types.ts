export { IntroSlideData, QuestionSlideData, SlideData, Lesson, LessonRecord } from "../features/lessons/lessons.model.ts"

export type SoundFile = File | undefined

export type MessageEvent = {
    message: string,
    returnURL?: string,

}


