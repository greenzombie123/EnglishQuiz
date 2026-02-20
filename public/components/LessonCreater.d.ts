import { IntroSlideRecord, QuestionSlideRecord } from "../shared.types.ts";
import "./FieldSet.ts";
import "./GroupNameSelector.ts";
import "./audio/AudioInput.ts";
export type LessonInfo = {
    name: string;
    groupname: string;
    slides: (IntroSlideRecord | QuestionSlideRecord)[];
};
//# sourceMappingURL=LessonCreater.d.ts.map