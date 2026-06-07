export type SlideType = "intro" | "question"

export class Slide {
    slideorder: number
    slidetype: SlideType
    // soundurl:string

    constructor(slideorder: number, type: SlideType) {
        this.slideorder = slideorder
        this.slidetype = type
    }
}   