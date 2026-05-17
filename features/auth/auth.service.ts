import { pool } from "../../config/database.config.ts";
import { v4 as createId } from "uuid";
import { Student, Teacher } from "./auth.model.ts";

// Add new teacher to the database
export const handleAddNewTeacher = async (username: string, password: string) => {
  const id = createId();
  await Teacher.create(username, password, id)
};

// Add new student to the database
export const handleAddNewStudent = async (username: string, password: string) => {
  const id = createId();
  await Student.create(username, password, id)
};

// Check if the user has already registered or not
export const handleDoesUserExist = async (username: string, password: string) => {
  const teachers = await pool.query(
    "SELECT * FROM teachers WHERE username = $1",
    [username]
  );
  const students = await pool.query(
    "SELECT * FROM students WHERE username = $1",
    [password]
  );

  if (teachers.rowCount === null || students.rowCount === null) return false;
  else if (teachers.rowCount + students.rowCount === 0) return false;
  return true;
};
