import "./FieldSet.ts";
import "./GroupNameSelector.ts";
import type { IntroSlideData } from "./IntroSlide.ts";
import type { QuestionSlideData } from "./QuestionSlide.ts";
export type LessonInfo = {
    name: string;
    groupname: string;
    slides: (IntroSlideData | QuestionSlideData)[];
};
//# sourceMappingURL=LessonCreater.d.ts.map