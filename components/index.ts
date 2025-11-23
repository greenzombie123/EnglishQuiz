import "./Lesson.ts";

type Lesson = {
  teacherId: string; //uuid
  id: number;
  name: string;
  slides: Slide[];
};

type QuestionSlide = {
  id: number;
  type: "question";
  question: string;
  correctAnswer: string;
  wrongAnswer1: string;
  wrongAnswer2: string;
  wrongAnswer3: string;
};

type VocabSlide = {
  id: number;
  type: "vocab";
  targetWord: string;
  definition: string;
};

type Slide = VocabSlide | QuestionSlide;

const slideState = () => {
  const slides: Slide[] = [];
  const currentSlideIndex: number | "Finished" = 0;

  const changeSlide = (nextIndex: number) => {};
  const setSlides = (slides: Slide[]) => {};
  const getCurrentSlide = () => {};

  return {
    changeSlide,
    setSlides,
    getCurrentSlide,
  };
};

export const startLesson = () => {};

const getLesson = () => {};
