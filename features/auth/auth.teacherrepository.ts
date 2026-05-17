import { pool } from "../../config/database.config.ts";

export class TeacherRepository {
    async addTeacher(username: string, password: string, id: string) {
        await pool.query(
            "INSERT INTO teachers (username, password, id) VALUES($1,$2,$3)",
            [username, password, id]
        );
    }
}