import "./Lesson.ts";
import type { Lesson, LessonSlider } from "./Lesson.ts";
import { Slide } from "./SlideState.ts";
import type { IntroSlideData } from "./IntroSlide.ts";
import type { QuestionSlideData } from "./QuestionSlide.ts";

declare const lessonId: number;
declare const lessonName: string;

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

const getLessonSlider = () =>
  document.querySelector("lesson-slider") as LessonSlider; //HTMLLessonSlider;

const mockIntroSlides: Lesson = {
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

const getLesson = async (lessonId: number): Promise<Slide[]> => {
  return await fetchLesson(lessonId);
 
};
// await mockIntroSlides;

const fetchLesson = async (lessonId: number) => {
  const response = await fetch(`/lessons/get/${lessonId}`);
  return response.json();
};



startLesson();
