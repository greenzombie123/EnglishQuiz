import { pool } from "../../config/database.config.ts"

class Teacher{
    constructor(){}

    getTeacher = async (teacher:string)=>{
        const {rows} = await pool.query<Teacher>("SELECT * FROM teachers WHERE username = $1", [teacher])

        const foundTeacher = rows[0]
    }
}

export default new Teacher