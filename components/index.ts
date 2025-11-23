import type { IntroSlideType } from "./IntroSlide.ts";
import "./Lesson.ts";
import type { HTMLLessonSlider, Lesson } from "./Lesson.ts";
import type { Slide } from "./SlideState.ts";

const startLesson = async () => {
  // get reference for lesson component
  const lessonSlider = getLessonSlider();
  const lesson = await getLesson(1);
    console.log(lesson)
  // call getLesson to get slides
  // pass slides to component
  // render slides
};

const getLessonSlider = () =>
  document.getElementById("lesson-slider") as HTMLLessonSlider;

const mockIntroSlides: Lesson = {
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

const getLesson = async (lessonId: number): Promise<Lesson> =>
  await mockIntroSlides;

startLesson();
