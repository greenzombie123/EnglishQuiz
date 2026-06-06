import { pool } from "../../config/database.config.ts";
import { v4 as createId } from "uuid";
import { Student, Teacher } from "./auth.model.ts";
import { User } from "../users/Users.model.ts";
import { Role } from "../users/Users.types.ts";

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
export const handleDoesUserExist = async (username: string, role: Role) => {
  if (role === "teacher") return await User.doesUserExist(username, "teacher")
  return await User.doesUserExist(username, "student")
};
