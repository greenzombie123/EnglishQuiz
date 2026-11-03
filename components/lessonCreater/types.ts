import { DatabaseAction, IntroSlide, Lesson, QuestionSlide, Recording } from "../types.ts";

export type LessonData = Omit<InstanceType<typeof Lesson>, "slides"> & {
    intro: IntroSlide[],
    question: QuestionSlide[],
    deleteSlideIds: { id: string, slideType: string }[]
}

export type SlideChanged = {
    action: "slideChanged",
    slideOrder: number,
    field: keyof IntroSlide | keyof QuestionSlide
    value: unknown
}

export type LessonDataChanged = {
    action: "lessonDataChanged",
    field: Omit<keyof LessonData, "id">
    value: string
}


export type SlideAdded = {
    action: "slideAdded",
    value: "intro" | "question"
}

export type SlideOrderChanged = {
    action: "slideOrderChanged",
    oldSlideOrder: number,
    newSlideOrder: number
}

export type SlideDeleted = {
    action: "slideDeleted",
    slideorder: number,
    id: string,
    slideType: string,
    databaseAction: DatabaseAction
}

export type AudioFilesUpdated = {
    action: "audioFilesUpdated",
    recording: Recording
}

export type AudioFileDeleted = {
    action: "audioFileDeleted",
    id: string
    name: string
}

export type SlideRecordingsChanged = {
    action: "SlideRecordingsChanged",
    slideOrder: number,
    field: keyof IntroSlide | keyof QuestionSlide
    value: string[]
}

export type StateChanged = SlideChanged | LessonDataChanged | SlideAdded | SlideOrderChanged | SlideDeleted | AudioFilesUpdated | AudioFileDeleted


