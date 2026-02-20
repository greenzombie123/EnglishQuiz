import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "dotenv/config";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      KEY: string;
      SECRETKEY:string;
      REGION:string;
      ENDPOINT:string;
      BUCKET:string
    }
  }
}

const s3Client = new S3Client({
  apiVersion:"latest",
    credentials: {
    accessKeyId: process.env.KEY,
    secretAccessKey: process.env.SECRETKEY
  },
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT,
});

const main = async () => {
  const response = await s3Client.send(
    new PutObjectCommand({
      Bucket: "stored-samosa-xhhvdkseggh",
      Key: "abda.txt",
      Body: "Hello",
    }),
  );

  console.log(response)


//   const { Body } = await s3Client.send(
//     new GetObjectCommand({
//       Bucket: "stored-samosa-xhhvdkseggh",
//       Key: "abd",
//     }),
//   );

//   console.log(await Body?.transformToString());

//   const listObjects = new ListObjectsCommand({Bucket:process.env.BUCKET})
//   const result = await s3Client.send(listObjects)
//   console.log(result, result.Contents)

// const command = new GetObjectCommand({Bucket:process.env.BUCKET, Key:"abd.txt"})
// const url = await getSignedUrl(s3Client, command, {expiresIn:1000})
// console.log(url)
};

main();
