import { pool } from "../../config/database.config.ts";
import { v4 as createId } from "uuid";
import { Student, Teacher } from "./auth.model.ts";
import { User } from "../users/Users.model.ts";

// Add new teacher to the database
export const handleAddNewTeacher = async (username: string, password: string) => {
  const id = createId();
  await User.registerUser(username, password, id, "teacher")
};

// Add new student to the database
export const handleAddNewStudent = async (username: string, password: string) => {
  const id = createId();
  await User.registerUser(username, password, id, "student")
};

// Check if the user has already registered or not
export const handleDoesUserExist = async (username: string) => {
  
  const teacher = await Teacher.findByUserName(username)

  if(teacher) return true

  const student = await Student.findByUserName(username)

  return student ? true : false
};
