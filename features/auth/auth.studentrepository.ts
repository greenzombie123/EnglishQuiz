import { pool } from "../../config/database.config.ts";

export class StudentRepository {
    async addStudent(username: string, password: string, id: string) {
        await pool.query(
            "INSERT INTO students (username, password, id) VALUES($1,$2,$3)",
            [username, password, id]
        );
    }

    async findByUsername(username: string): Promise<unknown> {
        const studentsRow = await pool.query(
            "SELECT * FROM students WHERE username = $1",
            [username]
        );

        return studentsRow.rows[0]
    }
}

