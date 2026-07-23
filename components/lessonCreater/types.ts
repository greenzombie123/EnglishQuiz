import { IntroSlideData, Lesson, QuestionSlideData } from "../../features/lessons/lessons.model.ts";
export { IntroSlideData, QuestionSlideData, SlideData} from "../../features/lessons/lessons.model.ts"

export type LessonData = Omit<InstanceType<typeof Lesson>, "slides"> & { intro: IntroSlideData[], question: QuestionSlideData[] }
export type LessonRecord = InstanceType<typeof Lesson>

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

export type StateChanged = SlideChanged | LessonDataChanged | SlideAdded | SlideOrderChanged | SlideDeleted


