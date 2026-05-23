import { pool } from "../../config/database.config.ts";
import type { Teacher } from "./auth.model.ts";

export class TeacherRepository {
    async addTeacher(username: string, password: string, id: string) {
        await pool.query(
            "INSERT INTO teachers (username, password, id) VALUES($1,$2,$3)",
            [username, password, id]
        );
    }

    async findByUserName(username: string) {
        const teacherRow = await pool.query<Teacher>(
            "SELECT * FROM teachers WHERE username = $1",
            [username]
        );

        return teacherRow.rows[0]
    }
}