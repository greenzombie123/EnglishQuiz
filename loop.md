```ts

const getIndexPage = ()=>{}
const getLogInPage = ()=>{}
const getSignUpPage = ()=>{}

// Send name and password
const logIn = (req:Request)=>{}

// Teacher
const getTeacherLessonsPage = ()=>{}

// Student
const getStudentLessonsPage = ()=>{}

const getCreateLessonPage = ()=>{}
const postNewLesson = ()=>{}


const postSignUpData =()=>{}
const getFindTeacherPage =()=>{}
const findTeacher =()=>{}
const getSignUpFinished = ()=>{}

const getLessonPage = ()=>{}
const postLessonPage = ()=>{}

```

1. User visit the website's front page
```ts
// Index Router 
router.get("/", getIndexPage)
```

2. User goes to sign up page with get request `/signup`

If not signed up
3. User enters their info and then clicks the ok button.
    1. User enters a username and password
    2. User clicks rather they are a student or teacher.
    3. If teacher, send post request `/signup`
        1. Get request on the server.
        2. Retreive the values for username, password and type.
        3. Check if username already exists
            1. If not, create teacher row and add it to teacher's table.
                1. Redirect them to `/signupcompleted`.
                2. Send signupcompleted page
                3. Click on button to them to lessons page. //=> lessons page
            2. If so, redirect them to `/signup/error/taken` or `/signup/error/badinput`
                1. Error taken page takes user back to signup page
        If student, same as teacher but take to `/findTeacher` after creating student row.
            1. User types and sends the username of teacher as post request `/findTeacher`.
            2. Find username in database
                1. If found, redirect to `/confirmTeacher`
                    1. If press Yes, send post request `/confirmTeacher`.
                        1. Get their id using username and add to teacherId in student row.
                        2. Redirect to `/signupcompleted` like the teacher user. //=> lessons page
                    2. If press No, go back to `/findTeacher`
                2. If not, send them to `/signup/error/teacherNotFound`.
                    1. Press button to go back to find teacher page.
                
If signed up
2. If user has already signed up, they press the log in button and go the the log in page

```ts
// LogIn Router 
router.get("/login", getLoginPage)

```

3. User types their name and password and sends them to the server. 
    1. Validate and sanitize the form 
    2. Authenticate the user (check if the user is in the database and their password matches)
    3. If info matches, query the user's data `Student` or `Teacher`.
    4. Use the data to render the lesson page.
        1. If user is a student, use the `LessonInfo[]` data from the `Student` data to generate the lesson links and render their name on the top.
        2. If a teacher, use the `TeacherLessonInfo[]` data from the `Teacher` data to generate the lesson links, render their name, and the create lesson button. 

```ts
// LogIn Router 
router.post("/login", getLoginPage)

```

4. If the user is a student and is on the lessons page, they click on a lesson link. Link has teacher's user name and id for lesson. 
    1. Server gets the request on path `/lesson/teacherId/lessonID`.
    2. Send back the lesson page.
    3. On the client, get the query search string from the url of the response.
    4. Fetch the lesson from the database.
    5. Create the html elements.
    6. Start the quiz 

```ts
router.get("/lesson/jackson22/1")

```

5. When the student finishes the quiz and click on the return to lessons page button, return them back to the lessons page.
    1. Send a post request `/lesson/teacherId/LessonId`
    2. Server gets the request
    3. Add the lessonId to the `completedLessons` array of the `Student` in the database.
    4. Grab the newly updated `Student` data and `lessons`, has `lessonId[]`, from `Teacher`. 
    5. Render the new html with the `Student` and `lessons` data. 
        1.  If `completedLessons` and `lessons` have the same `lessonId`, change the color of the link. 
    6. Send the html. 

6. If the user is a teacher and afte successfully signing up, get the lessons page just like student but with some exceptions.
    1. Check if the user's `type` prop and see if they are a teacher.
    2. If so, render a button that when pressed sends the user to the create lessons page.
    3. Teacher can do lessons but after a lesson is done do not call the function that "completes lesson" like the student.
    4. Render delete button for each lesson
        1. Send post request when clicked `/lessons/delete/lessonId`
        2. Delete the lesson from lessons table using `lessonId` and `teacherId`.
        3. Redirect user back to lessons page.
    5. Render edit button for each lesson
        1. Send get request when clicked `/createlessons/lessonId`
        2. Retrieve lesson.
        3. Render the create lesson page by passing the lesson object into the ejs page.

7. Pressing the create lesson button takes the user to the create lesson page.
    1. Send a get request `/createlesson`
    2. Send lesson create page.

8. When user is done create their lesson, they press the finish button.
    1. Check to make sure there is a lesson name and that all slides' inputs are filled.
    2. Send post request `/createlesson` with the form.
    3. Grab the form, validate it, and sanitize it. 
    4. Create a lesson object and add data to it, including teacher's Id
    5. Add lesson to the lessons table of the database.
    6. Get lesson's Id and add to teacher's lessons column.
    7. Redirect the user back to the lessons page.

---------------------------------------------------------------------------------------------------------------------




 


