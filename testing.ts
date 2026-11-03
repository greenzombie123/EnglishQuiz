import { S3Client, ListObjectsCommand, PutObjectCommand, PutBucketCorsCommand, type ListObjectsV2Request, ListObjectsV2Command, GetObjectCommand, type PutBucketCorsCommandInput } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "dotenv/config";
import { readFile, writeFile } from "fs/promises";
import { s3client } from "./config/s3client.config.ts";

async function mainModule() {
    
    const s3Client = new S3Client({
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.KEY,
            secretAccessKey: process.env.SECRETKEY
        },
        endpoint:process.env.ENDPOINT
    })

    // const listobjects = new ListObjectsCommand({Bucket:process.env.BUCKET, Prefix:"2"})

    // const put = new GetObjectCommand({
    //     Bucket: process.env.BUCKET,
    //     Key: "ice.txt"
    // })

    // const n = await readFile("./public/hello.mp3")

    // const put = new PutObjectCommand({
    //     Bucket: process.env.BUCKET,
    //     Key: "BOP.txt",
    //     Body:"WHY!?!?!?"
    // })

    // return getSignedUrl(s3Client, get)

    // try {
    //     const b = await s3Client.send(put)
    //     // const b = await Body?.transformToByteArray()

    // } catch (error) {
    //     console.error(error)
    // }

    // const req:ListObjectsV2Request = {
    //     Bucket:process.env.BUCKET,
    //     Prefix:"0/"
    // }

    // const listcommand = new ListObjectsV2Command(listobjects)

    const option:PutBucketCorsCommandInput = {
        Bucket:process.env.BUCKET,
        CORSConfiguration:{
            CORSRules:[
                {
                    AllowedMethods:["PUT", "DELETE", "POST", "GET"],
                    AllowedHeaders:["*"],
                    AllowedOrigins:["*"],
                    MaxAgeSeconds:5000
                }
            ]
        }
    }

    const putBucketCorsCommand = new PutBucketCorsCommand(option)

    const response = await s3Client.send(putBucketCorsCommand)

    console.log(response)

    return
}

await mainModule()
