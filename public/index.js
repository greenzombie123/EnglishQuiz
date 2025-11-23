import "./Lesson.js";
const startLesson = async () => {
    // get reference for lesson component
    const lessonSlider = getLessonSlider();
    const lesson = await getLesson(1);
    console.log(lesson);
    // call getLesson to get slides
    // pass slides to component
    // render slides
};
const getLessonSlider = () => document.getElementById("lesson-slider");
const mockIntroSlides = {
    id: 13,
    name: "Mock",
    slides: [
        {
            id: 1,
            sliderOrder: 1,
            type: "intro",
            targetWord: "Apple",
            definition: "リンゴ",
        },
        {
            id: 245,
            sliderOrder: 2,
            type: "intro",
            targetWord: "Orange",
            definition: "オレンジ",
        },
    ],
};
const getLesson = async (lessonId) => await mockIntroSlides;
startLesson();
//# sourceMappingURL=index.js.map