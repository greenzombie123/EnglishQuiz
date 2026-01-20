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
  // soundurl:string,
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
    lessonId:string
}

// declare global {
//     namespace Express {
//         interface Request {
//             body:{
//                 question:
//             }
//         }
//     }
// }

// req.body as {
//     question: QuestionSlide[] | undefined;
//     intro: IntroSlide[] | undefined;
//     lessonName: string;
//     groupname: string;
//     lessonId:string
//   };
