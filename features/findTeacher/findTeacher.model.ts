import { pool } from "../../config/database.config.ts"

export class FindTeacher {
    static addToTeachersStudents = async (teacherUsername: string, studentUserName: string) => {
        await pool.query("INSERT INTO teachers_students (teacherUserName, studentUserName) VALUES($1, $2)",
            [teacherUsername, studentUserName])
    }

    static getTeacherUserName = (teacherUserName: string): string => { }
}