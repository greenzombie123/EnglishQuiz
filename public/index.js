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
const getLessonSlider = () => document.querySelector("lesson-slider"); //HTMLLessonSlider;
const mockIntroSlides = {
    id: 13,
    name: "Mock",
    slides: [
        {
            type: "question",
            question: "What is an orange?",
            correctAnswer: "An orange fruit",
            wrongAnswer1: "Yo mama!",
            wrongAnswer2: "Yo dead cat!",
            wrongAnswer3: "Yo...um...yo?",
        },
        {
            type: "intro",
            targetWord: "Apple",
            definition: "リンゴ",
        },
        {
            type: "intro",
            targetWord: "Orange",
            definition: "オレンジ",
        },
        {
            type: "question",
            question: "What is an apple?",
            correctAnswer: "A fruit",
            wrongAnswer1: "Yo mama!",
            wrongAnswer2: "Yo dead cat!",
            wrongAnswer3: "Yo...um...yo?",
        },
    ],
};
const getLesson = async (lessonId) => {
    return await fetchLesson(lessonId);
};
// await mockIntroSlides;
const fetchLesson = async (lessonId) => {
    const response = await fetch(`/lessons/get/${lessonId}`);
    return response.json();
};
startLesson();
//# sourceMappingURL=index.js.map