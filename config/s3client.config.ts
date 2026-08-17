import { S3Client } from "@aws-sdk/client-s3";
export { getSignedUrl as createSignedUrls } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";

import "dotenv/config";

export const s3client = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.KEY,
        secretAccessKey: process.env.SECRETKEY
    },
    endpoint: process.env.ENDPOINT
})

// export const putAudioFiles = (fileName:string)=>{
//     return new PutObjectCommand(process.env.BUCKET, )
// } 