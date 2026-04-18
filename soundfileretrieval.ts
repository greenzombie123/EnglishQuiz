import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  paginateListObjectsV2,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
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
  // const command = new ListObjectsV2Command({Bucket:process.env.BUCKET})
  // const results = await s3Client.send(command)
  // console.log(results)

  // const getCommand = new GetObjectCommand({Bucket:process.env.BUCKET, Key:"abda.txt"})
  // const url = await getSignedUrl(s3Client, getCommand)

  // const {url} = await createPresignedPost(s3Client, {Bucket:}) 
};

main();
