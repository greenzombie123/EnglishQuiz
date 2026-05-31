export interface AddStudentToTeacherRequest {
    teacher:string
    user:User
}

export type User = {
  username: string;
  password: string;
};

// export type Teacher = User & {
//   userType: "teacher";
// };

// export type Student = User & {
//   userType: "student";
// };