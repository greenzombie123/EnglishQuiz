import type { Request, Response, NextFunction } from "express";
import { pool } from "../pool.ts";

type LessonData = {
    name:string,
    id:number
}

export const getDashBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return res.redirect("/");
  const { username, userType } = req.user;
  const lessonsData = await getLessons(userType, username)

  res.locals = { username, userType, lessonsData };
  res.render("dashboard");
};


const getLessons = async (userType: string, userName: string) => {
    const queryString = getQueryString(userType)
    
    const {rows} = await pool.query<LessonData>(queryString, [userName])

    return rows
};

const getQueryString = (userType: string) => {
  if (userType === "student") {
    return `SELECT lessons.name, lessons.id FROM lessons
            INNER JOIN teachers
            ON lessons.teacherid = teachers.id
            INNER JOIN teachers_students
            ON teachers.username = teachers_students.teacherusername
            WHERE teachers_students.studentusername = $1`;
  } else
    return `SELECT lessons.name, lessons.id FROM lessons
            INNER JOIN teachers
            ON lessons.teacherid = teachers.id
            WHERE teachers.username = $1`;
};
