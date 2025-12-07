import express from "express";
import views from "./dirNames.ts";
import indexRouter from "./routes/index.ts";
import signupRouter from "./routes/signup.ts";
import "dotenv/config";
import { Pool } from "pg";
import passport from "passport";
import session from "express-session";
import { Strategy } from "passport-local";
import logInRouter from "./routes/login.ts";
import lessonsRouter from "./routes/lessons.ts";
import findTeacherRouter from "./routes/findTeacher.ts";

// Set up Pool to query Postgres through node
export const pool = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
});

// Create a server
const server = express();

// Have Express get views from views directory and set view engine to ejs
server.set("views", views);
server.set("view engine", "ejs");

// Set up Express to parse forms and JSON
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// Serve static files from views directory.
// First one create a vitual path that will point to the directory.
// Also serve the ts files through the source maps for debuggin

server.use(express.static("views"));
server.use("/components", express.static("components"));
server.use("/lessons", express.static("public"));

server.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
   // cookie: { maxAge: 600000 },
  })
);

// Set up session middleware
server.use(session({ secret: process.env.SECRET! }));

// Allows you to authenticate a session wheneve a request comes in
server.use(passport.session());

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

passport.use(strategy);

// Routers

server.use("/findTeacher", findTeacherRouter);
server.use("/lessons", lessonsRouter);
server.use("/login", logInRouter);
server.use("/signup", signupRouter);
server.use("/", indexRouter);

// server.use("/signup",signupRouter)

server.listen(3000, (error) => {
  if (error) throw error;

  console.log("Running server on port 3000");
});
