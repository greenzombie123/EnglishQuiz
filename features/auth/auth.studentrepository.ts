import { pool } from "../../config/database.config.ts";

export class StudentRepository {
    async addStudent(username: string, password: string, id: string) {
        await pool.query(
            "INSERT INTO students (username, password, id) VALUES($1,$2,$3)",
            [username, password, id]
        );
    }
}

