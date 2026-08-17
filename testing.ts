import { S3Client, ListObjectsCommand, GetObjectCommand, CORSConfiguration } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "dotenv/config";
import { readFile } from "fs/promises";

async function mainModule() {
    
    const s3Client = new S3Client({
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.KEY,
            secretAccessKey: process.env.SECRETKEY
        },
        endpoint:process.env.ENDPOINT
    })

    const listobjects = new ListObjectsCommand({Bucket:process.env.BUCKET})

    const get = new GetObjectCommand({
        Bucket: process.env.BUCKET,
        Key: "bbb/nn/hello.mp3"
    })

    // const n = await readFile("./public/hello.mp3")

    // const put = new PutObjectCommand({
    //     Bucket: process.env.BUCKET,
    //     Key: "good.txt"
    // })

    return getSignedUrl(s3Client, get)

    // try {
    //     const b = await s3Client.send(put)
    //     // const b = await Body?.transformToByteArray()
    //     console.log(b)
    // } catch (error) {
    //     console.error(error)
    // }
}

const b = await mainModule()

// const n = await fetch(b, {
//     method:"PUT",
//     body:"WOW"
// })

console.log(b)