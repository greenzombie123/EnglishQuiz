type BaseUser = {
    username: string;
    password: string;
    id: string;
};
type Student = BaseUser & {
    type: "student";
};
type Teacher = BaseUser & {
    type: "teacher";
};
export type User = Student | Teacher;
type BaseSlideRecord = {
    slideorder: number;
};
export type QuestionSlideRecord = BaseSlideRecord & {
    type: "question";
    question: string;
    correctanswer: string;
    wronganswer1: string;
    wronganswer2: string;
    wronganswer3: string;
};
export type IntroSlideRecord = BaseSlideRecord & {
    type: "intro";
    targetword: string;
    definition: string;
};
export type SlideRecord = QuestionSlideRecord | IntroSlideRecord;
export interface AddLessonBody {
    question: QuestionSlideRecord[] | undefined;
    intro: IntroSlideRecord[] | undefined;
    lessonName: string;
    groupname: string;
    lessonId: string;
}
export interface LessonIdParams {
    lessonId: string;
}
export interface AddStudentToTeacherBody {
    teacher: string;
}
export type LessonData = {
    name: string;
    groupname: string;
    slides: SlideRecord[];
};
export type LessonSlideData = Record<SlideRecord["type"], SlideRecord[] | []>;
export {};
//# sourceMappingURL=shared.types.d.ts.map