import type { IntroSlideRecord, QuestionSlideRecord } from "./shared.types.ts";
import { format } from "node-pg-format";

export const queryIntroSlideRecords = `
    SELECT targetword, definition, slideorder, type FROM introslides
    INNER JOIN lessons_introslides
    ON lessons_introslides.introslideid = introslides.id
    WHERE lessons_introslides.lessonid = $1
`

export const queryQuestionSlideRecords = `
    SELECT question, correctanswer,  wronganswer1, wronganswer2, wronganswer3, slideorder, type FROM questionslides 
    INNER JOIN lessons_questionslides 
    ON lessons_questionslides.questionslideid = questionslides.id
    WHERE lessons_questionslides.lessonid = $1
    ORDER BY slideorder;
`

const updateQSQueryString = `
UPDATE questionslides
SET question=$1, 
    correctanswer=$2, 
    wronganswer1=$3, 
    wronganswer2=$4,
    wronganswer3=$5,
    slideorder=$6,
    soundurl=$7
WHERE id = $9
`

const updateISQueryString = `
UPDATE introslides, 
SET targetword=$1, 
    definition=$2, 
    slideorder=$3,
    soundurl=$4
WHERE id = $5
`;