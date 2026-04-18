import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { s3Client } from "./s3client.ts";
import type { SlideRecord } from "../shared.types.ts";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      KEY: string;
      SECRETKEY: string;
      REGION: string;
      ENDPOINT: string;
      BUCKET: string;
    }
  }
}

export type PresignUrlData = {url:string, key:string}

const Expires = 600;

export const createPresignedUrls = async (
  fileNames: string[],
  lessonId: string,
  teacherId: string,
):Promise<PresignUrlData[]> => {
  const presignedUrls = fileNames.map(async (fileName) => {
    const audioFileName = `${teacherId}/${lessonId}/${fileName}`;

    // const fileEx = fileName.slice(0,fileName.lastIndexOf("."))

    const putCommand = new PutObjectCommand({Bucket:process.env.BUCKET, Key:audioFileName})
    const url = await getSignedUrl(s3Client, putCommand)

    return {
      url,
      key:fileName
    }
  });

  return await Promise.all(presignedUrls)
};

export const extractAudioFiles = (
  ...slideRecordArrays: (SlideRecord[] | undefined)[]
) => {
  const slideArrays = slideRecordArrays.map((slideRecords) =>
    slideRecords ? slideRecords : [],
  );

  let soundUrls: string[] = [];

  slideArrays.forEach((slideArray) => {
    slideArray.forEach((slide) => {
      if (slide.soundurl) soundUrls.push(slide.soundurl);
    });
  });

  const s = new Set(soundUrls)

  return [...s]

  return soundUrls;
};
