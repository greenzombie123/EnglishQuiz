import "./Lesson.js";
const startLesson = async () => {
    // get reference for lesson component
    const lessonSlider = getLessonSlider();
    // call getLesson to get slides
    const lesson = await getLesson(1);
    const { slides } = lesson;
    // pass slides to component
    lessonSlider.setSlides(slides);
    // render slides
    lessonSlider.render();
};
const getLessonSlider = () => document.querySelector("lesson-slider"); //HTMLLessonSlider;
const mockIntroSlides = {
    id: 13,
    name: "Mock",
    slides: [
        {
            id: 1,
            sliderOrder: 0,
            type: "intro",
            targetWord: "Apple",
            definition: "リンゴ",
        },
        {
            id: 245,
            sliderOrder: 1,
            type: "intro",
            targetWord: "Orange",
            definition: "オレンジ",
        },
        {
            id: 442,
            sliderOrder: 2,
            type: "question",
            question: "What is an apple?",
            correctAnswer: "A fruit",
            wrongAnswer1: "Yo mama!",
            wrongAnswer2: "Yo dead cat!",
            wrongAnswer3: "Yo...um...yo?",
        },
        {
            id: 432,
            sliderOrder: 3,
            type: "question",
            question: "What is an orange?",
            correctAnswer: "An orange fruit",
            wrongAnswer1: "Yo mama!",
            wrongAnswer2: "Yo dead cat!",
            wrongAnswer3: "Yo...um...yo?",
        },
    ],
};
const getLesson = async (lessonId) => await mockIntroSlides;
startLesson();
//# sourceMappingURL=index.js.map