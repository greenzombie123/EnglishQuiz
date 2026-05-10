export interface AddStudentToTeacherBody {
    teacher:string
}

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