import { TeacherRepository } from "./auth.teacherrepository.ts"

const teacherRepo = new TeacherRepository() 

export class Teacher{
    constructor(){}

    static create = async (username:string, password:string, id:number)=>{
        await teacherRepo.addTeacher(username, password, id)
    }
}

export class Student{
    constructor(){}
}