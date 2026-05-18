import { pool } from "../../config/database.config.ts";
import * as z from "zod"
import { Teacher } from "./auth.model.ts";

// const Teacher = z.object({
//     username:z.string(),
//     password:z.string(),
//     id:z.string()
// })

// type Teacher = z.infer<typeof Teacher>

export class TeacherRepository {
    async addTeacher(username: string, password: string, id: string) {
        await pool.query(
            "INSERT INTO teachers (username, password, id) VALUES($1,$2,$3)",
            [username, password, id]
        );
    }

    async findByUserName(username: string):Promise<unknown> {
        const teacherRow = await pool.query(
            "SELECT * FROM teachers WHERE username = $1",
            [username]
        );

        return teacherRow.rows[0]
    }
}