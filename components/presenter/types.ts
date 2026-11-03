import { IntroSlide, Lesson, QuestionSlide } from "../types.ts"
import { LessonPresenter } from "./LessonPresenter.ts"

export type UserWrong = {
    action: "wrong"
}
export type UserCorrect = {
    action: "correct"
}

export type NextSlide = {
    action: "nextSlide"
}

export type PreviousSlide = {
    action: "previousSlide"
}

export type LessonFinished = {
    action: "lessonFinished"
}

export type UserActed = UserCorrect | UserWrong | NextSlide | PreviousSlide

export type UserActedKeyValue =
    UserCorrect[keyof UserCorrect] |
    UserWrong[keyof UserWrong] |
    NextSlide[keyof NextSlide] |
    PreviousSlide[keyof PreviousSlide]

export type Intro = IntroSlide & {
    recording: Blob
}

export type Question = QuestionSlide & {
    recording: Blob
}

export type LessonPresenterSlide = Intro | Question

export type CurrentLesson = Omit<Lesson, "slides"> & {
    slides: (Question | Intro)[]
}


