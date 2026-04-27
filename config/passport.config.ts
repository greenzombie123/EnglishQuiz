import passport from "passport";
import { pool } from "./database.config.ts";
import { Strategy } from "passport-local";

// Type for Students and Teachers
export type User = {
  username: string;
  password: string;
};

export type Teacher = User & {
  userType: "teacher";
};

export type Student = User & {
  userType: "student";
};

//Configure the strategy in how passport verifies and authenticate the user
const strategy = new Strategy(async function verify(username, password, done) {
  try {
    const { rows: studentRow } = await pool.query<User>(
      "SELECT * FROM students WHERE username=$1",
      [username]
    );

    const studentUser = studentRow[0];

    const { rows: teacherRow } = await pool.query<User>(
      "SELECT * FROM teachers WHERE username=$1",
      [username]
    );

    const teacherUser = teacherRow[0];

    if (studentUser) {
      if (studentUser.password === password) {
        const authenticatedStudent: Student = {
          ...studentUser,
          userType: "student",
        };
        return done(null, authenticatedStudent);
      }
    }

    if (teacherUser) {
      if (teacherUser.password === password) {
        const authenticatedTeacher: Teacher = {
          ...teacherUser,
          userType: "teacher",
        };
        return done(null, authenticatedTeacher);
      }
    }

    return done(null, false, { message: "Incorrect password" });
  } catch (error) {
    return done(error);
  }
});

passport.serializeUser(function (user, done) {
  return done(null, {
    username: user.username,
    userType: user.userType,
  });
});

passport.deserializeUser<Student | Teacher>(function (user, done) {
  return done(null, user);
});

passport.use(strategy)

export default passport