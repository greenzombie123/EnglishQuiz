// Type for Students and Teachers
export type User = {
  username: string;
  password: string;
};

export type Teacher = User & {
  userType: "teacher";
};

export type Student = User & {
  userType: "student";
};


type BaseSlideRecord = {
  soundurl:string,
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

export interface AddStudentToTeacherBody {
    teacher:string
}

export type LessonData = {
  name: string;
  groupname: string;
  slides:SlideRecord[]
};

export type LessonSlideData = Record<SlideRecord["type"], SlideRecord[] | []>

export type createBucketURL = (key:string, teacherId:string, lessonId:string)=>string

// const j : IntroSlideRecord = {
//   soundurl:"",
//   slideorder:1,
//   type:"intro",
//   definition:"fee",
//   targetword:"fee"
// }