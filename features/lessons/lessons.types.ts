import type { IntroSlide, LessonData, QuestionSlide } from "./lessons.model.ts"

export type SlideType = "intro" | "question"

export class Slide {
  slideorder: number
  soundurl: string

  constructor(slideorder: number, type: SlideType, soundurl: string) {
    this.slideorder = slideorder
    this.soundurl = soundurl
  }
}

// Contains lesson data structured by groupname. LessonData with no groupname are put in nogroupname array prop.
export type LessonStore = {
  [key: string]: LessonData[];
  nogroup: LessonData[]
};

export interface PostLessonFunc {
  (postLessonArg: PostLessonArg): void
}

export interface PostLessonArg {
  name: string
  groupname: string
  lessonId: number | "",
  introSlides: IntroSlide[]
  questionSlides: QuestionSlide[]
}

// type for post lesson form
export interface PostLessonReqBody {
  question: QuestionSlide[] | undefined;
  intro: IntroSlide[] | undefined;
  lessonName: string;
  groupname: string;
  lessonId: string;
}

export type PostLessonRejected = {
  isError:true,
  message:unknown
}

export type PostLessonPassed = {
  isError:false
}

export type PostLessonResult = PostLessonPassed | PostLessonRejected