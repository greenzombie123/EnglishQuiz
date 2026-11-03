export { IntroSlide, QuestionSlide, Lesson, LessonSlide } from "../features/lessons/lessons.model.ts"
export { DatabaseAction } from "../features/lessons/lessons.types.ts"
export { Recording } from "../features/audio/audio.model.ts"

export type SoundFile = File | undefined

export type MessageEvent = {
    message: string,
    returnURL?: string,

}

