import type { IntroSlideData } from "./IntroSlide.ts";
import "./Lesson.ts";
import type { Lesson, LessonSlider } from "./Lesson.ts";
import type { Slide } from "./SlideState.ts";

const startLesson = async () => {
  // get reference for lesson component
  const lessonSlider = getLessonSlider();

  // call getLesson to get slides
  const lesson = await getLesson(1);
  const {slides} = lesson
  
  // pass slides to component
  lessonSlider.setSlides(slides)

  // render slides
  lessonSlider.render()
};

const getLessonSlider = () =>
  document.querySelector("lesson-slider") as LessonSlider//HTMLLessonSlider;

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
