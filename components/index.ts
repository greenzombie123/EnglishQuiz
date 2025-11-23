import "./Lesson.ts";
import type { HTMLLessonSlider } from "./Lesson.ts";



const startLesson = () => {
    // get reference for lesson component
    const lessonSlider = getLessonSlider()
    console.log(lessonSlider)
    // call getLesson to get slides
    // pass slides to component
    // render slides
};

const getLessonSlider = ()=> document.getElementById("lesson-slider") as HTMLLessonSlider

const getLesson = () => {};

startLesson()
