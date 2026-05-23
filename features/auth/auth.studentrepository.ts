import { pool } from "../../config/database.config.ts";
import type { Student } from "./auth.model.ts";

export class StudentRepository {
    async addStudent(username: string, password: string, id: string) {
        await pool.query(
            "INSERT INTO students (username, password, id) VALUES($1,$2,$3)",
            [username, password, id]
        );
    }

    async findByUserName(username: string) {
        const studentsRow = await pool.query<Student>(
            "SELECT * FROM students WHERE username = $1",
            [username]
        );

        return studentsRow.rows[0]
    }
}

