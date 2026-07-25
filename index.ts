import express from "express";
import views from "./dirNames.ts";

import passport from "./config/passport.config.ts"
import session from "express-session";

import indexRouter from "./features/home/home.route.ts"
import lessonsRouter from "./features/lessons/lessons.route.ts";
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

/**
 *   When the client requests a static file, express.static helps Express seek the location of the file.
 *   When you send something like "components" to express.static, Express will attempt to find a file in
 *   a folder called "components". 
 *   If you pass a url string like "components" along with a string to express static, Express will only 
 *   seek files if the url, that was used to send the request, has the sub directory "components" in it AND if the file exists 
 *   in the directory represented by the string passed as an argument to express.static. 
 */


// For html ejs files
server.use(express.static("views"));

// For the generated source map files
server.use("/components", express.static("components"));


// For lesson page
server.use("/lessons", express.static("public/components"));

// For Lesson Creator Page
server.use(express.static("public/components"));

//TODO Only meant for testing. Remove when can!
server.use(express.static("public/client"));

server.use("/node_modules", express.static("node_modules"))

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