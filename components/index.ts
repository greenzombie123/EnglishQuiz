import "./Lesson.ts";
import type { Lesson, LessonSlider } from "./Lesson.ts";
import type { Slide } from "./SlideState.ts";
import type { IntroSlideData } from "./IntroSlide.ts";
import type { QuestionSlideData } from "./QuestionSlide.ts";

declare const lessonId: number;

const startLesson = async () => {
  // get reference for lesson component
  const lessonSlider = getLessonSlider();

  // call getLesson to get slides
  const lesson = await getLesson(lessonId);
  //   const { slides } = lessons;

  // pass slides to component
  lessonSlider.setSlides(lesson.slides);

  // render slides
  lessonSlider.render();
};

const getLessonSlider = () =>
  document.querySelector("lesson-slider") as LessonSlider; 

const getLesson = async (lessonId: number): Promise<Lesson> => {
  return await fetchLesson(lessonId);
 
};

const fetchLesson = async (lessonId: number) => {
  const response = await fetch(`/lessons/get/${lessonId}`);
  return response.json();
};



startLesson();
