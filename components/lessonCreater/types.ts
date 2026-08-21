import { IntroSlideData, Lesson, QuestionSlideData } from "../types.ts";

export type LessonData = Omit<InstanceType<typeof Lesson>, "slides"> & { intro: IntroSlideData[], question: QuestionSlideData[], isLessonNew:boolean }

// export type SlideData = IntroSlideData | QuestionSlideData

export type SlideChanged = {
    action: "slideChanged",
    slideOrder: number,
    field: keyof IntroSlideData | keyof QuestionSlideData
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
    slideorder: number
}

export type AudioFilesUpdated = {
    action: "audioFilesUpdated",
    audioFile: File
}

export type AudioFileDeleted = {
    action: "audioFileDeleted",
    name: string
}

export type StateChanged = SlideChanged | LessonDataChanged | SlideAdded | SlideOrderChanged | SlideDeleted | AudioFilesUpdated | AudioFileDeleted


