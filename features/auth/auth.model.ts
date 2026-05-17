import { StudentRepository } from "./auth.studentrepository.ts"
import { TeacherRepository } from "./auth.teacherrepository.ts"

const teacherRepo = new TeacherRepository() 
const studentRepo = new StudentRepository()

export class Teacher{
    constructor(){}

    static create = async (username:string, password:string, id:string)=>{
        await teacherRepo.addTeacher(username, password, id)
    }
}

export class Student{
    constructor(){}

    static create = async (username:string, password:string, id:string)=>{
        await studentRepo.addStudent(username, password, id)
    }
}