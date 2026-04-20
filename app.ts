import server from "./index.ts"

import indexRouter from "./routes/index.ts";
import signupRouter from "./routes/signup.ts";
import logInRouter from "./routes/login.ts";
import lessonsRouter from "./routes/lessons.ts";
import findTeacherRouter from "./routes/findTeacher.ts";


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
