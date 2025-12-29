import "./Lesson.js";
const startLesson = async () => {
    // get reference for lesson component
    const lessonSlider = getLessonSlider();
    // call getLesson to get slides
    const lessons = await getLesson(lessonId);
    //   const { slides } = lessons;
    // pass slides to component
    lessonSlider.setSlides(lessons);
    // render slides
    lessonSlider.render();
};
const getLessonSlider = () => document.querySelector("lesson-slider");
const getLesson = async (lessonId) => {
    return await fetchLesson(lessonId);
};
const fetchLesson = async (lessonId) => {
    const response = await fetch(`/lessons/get/${lessonId}`);
    return response.json();
};
startLesson();
//# sourceMappingURL=index.js.map