import type { PoolClient } from "pg";
import type { QuestionSlideRecord } from "../shared.types.ts";

export const getTeacherId = async (client: PoolClient, teacherName: string) => {
  const teacherIdQuery = "SELECT id FROM teachers WHERE username = $1";
  const { rows } = await client.query<{ id: string }>(teacherIdQuery, [
    teacherName,
  ]);

  return rows[0]?.id;
};

type LessonData = {
  teacherId: string;
  groupName: string;
  lessonName: string;
};

export const createLessonRow = async (
  client: PoolClient,
  { lessonName, teacherId, groupName }: LessonData,
) => {
  const { rows } = await client.query<{ id: string }>(
    `INSERT INTO lessons (name, teacherid, groupname) VALUES('${lessonName}', '${teacherId}', '${groupName}') RETURNING id`,
  );

  return rows[0]?.id;
};

// Check to see if a lesson already exists
export const hasLessonId = async (lessonId: string, client: PoolClient) => {
  const { rows } = await client.query(`SELECT FROM lessons WHERE id=$1`, [
    lessonId,
  ]);
  return rows.length ? true : false;
};

export const updateLessonRow = async (
  lessonId: string,
  client: PoolClient,
  name: string,
  groupName: string,
) => {
  await client.query(
    `
  UPDATE lessons 
  SET name=$1,
      groupname=$2
  WHERE id=$3
  `,
    [name, groupName, lessonId],
  );
};

export const updateQuestionSlides = async (
  questionSlides:QuestionSlideRecord[],
  lessonId:string,
  client:PoolClient
)=>{
  questionSlides.forEach(async questionSlide=>{
    const {question, correctanswer, wronganswer1, wronganswer2, wronganswer3, slideorder, soundurl} = questionSlide
    await client.query(`
        MERGE questionslides AS TARGET
          USING lessons_questionslides AS SOURCE

          ON(TARGET.id = SOURCE.questionslideid)
          WHEN MATCHED 
            AND SOURCE.lessonid = $1
          THEN UPDATE 
            SET question=$2,
                correctanswer=$3,
                wronganswer1=$4,
                wronganswer2=$5,
                wronganswer3=$6,
                slideorder=$7,
                soundurl=$8
      `)
  })
}

