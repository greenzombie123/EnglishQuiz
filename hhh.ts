import { GetBucketCorsCommand, GetObjectCommand, ListObjectsCommand, PutBucketCorsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import type { PutBucketCorsCommandInput } from "@aws-sdk/client-s3";
import { s3Client } from "./storage/s3client.ts";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs/promises"

const input: PutBucketCorsCommandInput = {
  Bucket: process.env.BUCKET,
  CORSConfiguration: {
    CORSRules: [
      {
        AllowedHeaders: ["*"],
        AllowedMethods: ["POST", "PUT"],
        AllowedOrigins: ["*"],
        MaxAgeSeconds: 1,
      },
    ],
  },
};

const g = new GetBucketCorsCommand({ Bucket: process.env.BUCKET });
const command = new PutBucketCorsCommand(input);
const response = await s3Client.send(g);

// const pp = await createPresignedPost(s3Client, {
//   Key: "test.txt",
//   Bucket: process.env.BUCKET,
//   Expires: 1000,
// });

// const frogSound = await fs.readFile("./frog.mp3")
// console.log(frogSound)

// const j = await getSignedUrl(s3Client, new PutObjectCommand({Bucket:process.env.BUCKET, Key:"ddd", ContentType:"audio/mpeg"}))

// console.log(j)

// const responsr = await fetch(j, {
//   method: "PUT",
//   body: frogSound,
//   headers: {
//     "Content-Type": "audio.mpeg",
//   },
// });

const getCommand = new GetObjectCommand({Bucket:process.env.BUCKET, Key:'019aa04d-a1ed-723d-a4b6-43187f330b88/66/lion.mp3'})
const url = await getSignedUrl(s3Client, getCommand)
// const t = new ListObjectsCommand({Bucket:process.env.BUCKET})

// const h = new GetObjectCommand({Bucket:process.env.BUCKET, Key:'019aa04d-a1ed-723d-a4b6-43187f330b88/66/lion.mp3'})
// const b = await s3Client.send(h)

console.log(url)

// console.log(await b.Body?.transformToString())
// console.log(response.CORSRules);

// console.log(await b.Body?.transformToByteArray())
