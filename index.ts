import express from "express";
import views from "./dirNames.ts";

import passport from "./config/passport.config.ts"
import session from "express-session";

import indexRouter from "./routes/index.ts";
import lessonsRouter from "./routes/lessons.ts";
import findTeacherRouter from "./features/findTeacher/findTeacher.route.ts";
import {signupRouter, logInRouter} from "./features/auth/auth.route.ts"

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
// Also serve the ts files through the source maps for debugging

// For html ejs files
server.use(express.static("views"));

// For the generated source map files
server.use("/components", express.static("components"));

// For lesson page
server.use("/lessons", express.static("public/components"));

// For Lesson Creator Page
server.use(express.static("public/components"));

// For everything in the public folder
server.use(express.static("public"));

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

// Allows you to authenticate a session whenever a request comes in
server.use(passport.session());

// Routers

server.use("/findTeacher", findTeacherRouter);
server.use("/lessons", lessonsRouter);
server.use("/login", logInRouter);
server.use("/signup", signupRouter);
server.use("/", indexRouter);

export default server