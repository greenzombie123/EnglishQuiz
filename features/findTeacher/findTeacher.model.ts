import { pool } from "../../config/database.config.ts"

export class FindTeacher {
    static addToTeachersStudents = async (teacherUsername: string, studentUserName: string) => {
        await pool.query("INSERT INTO teachers_students (teacherUserName, studentUserName) VALUES($1, $2)",
            [teacherUsername, studentUserName])
    }

    static doesTeacherExist = async (teacherUserName: string):Promise<boolean> => { 
        const {rows} = await pool.query("SELECT * FROM teachers WHERE username = $1", [teacherUserName])
        return (rows[0] && (rows[0].username === teacherUserName))
    }
}