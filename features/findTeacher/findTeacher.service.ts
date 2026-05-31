import { FindTeacher } from "./findTeacher.model.ts"

export const addToTeachersStudents = async (teacherUsername: string, studentUserName: string)=>{
    await FindTeacher.addToTeachersStudents(teacherUsername, studentUserName)
}
export const doesTeacherExist = async (teacherUserName:string)=>{
    return await FindTeacher.doesTeacherExist(teacherUserName)
}