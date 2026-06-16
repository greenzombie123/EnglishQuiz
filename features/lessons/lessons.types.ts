import type { LessonData } from "./lessons.model.ts"

export type SlideType = "intro" | "question"

export class Slide {
    slideorder: number
    slidetype: SlideType
    soundurl:string

    constructor(slideorder: number, type: SlideType, soundurl:string) {
        this.slideorder = slideorder
        this.slidetype = type
        this.soundurl = soundurl
    }
}

// Contains lesson data structured by groupname. LessonData with no groupname are put in nogroupname array prop.
export type LessonStore = {
    [key: string]: LessonData[];
    nogroup:LessonData[]
};