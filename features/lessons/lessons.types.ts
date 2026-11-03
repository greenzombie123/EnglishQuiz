import { Recording } from "../audio/audio.model.ts"
import type { IntroSlide, LessonData, QuestionSlide } from "./lessons.model.ts"

export type SlideType = "intro" | "question"

export type DatabaseAction = "add" | "update"

export class BaseSlide {
  slideorder: number
  lessonid: number | undefined
  id: string
  action: DatabaseAction
  recordings: string[] = []

  constructor(slideorder: number, lessonid: number | undefined, id: string, action: DatabaseAction) {
    this.slideorder = slideorder
    this.lessonid = lessonid
    this.id = id
    this.action = action
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
  lessonId: number | undefined,
  introSlides: IntroSlide[]
  questionSlides: QuestionSlide[],
  teacherName: string,
  deleteSlideIds: { id: string, slideType: string }[]
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
  isError: true,
  message: unknown
}

export type PostLessonPassed = {
  isError: false
}

export type PostLessonResult = PostLessonPassed | PostLessonRejected