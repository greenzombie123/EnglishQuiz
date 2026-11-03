import { DeleteObjectsCommand, type DeleteObjectsCommandInput, GetObjectCommand, type GetObjectCommandInput, ListObjectsV2Command, type ListObjectsV2Request, S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import "dotenv/config";

export const s3client = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.KEY,
        secretAccessKey: process.env.SECRETKEY
    },
    endpoint: process.env.ENDPOINT
})

export const createPostPresignedUrl = async (key:string) => {
    const command = new PutObjectCommand({ Bucket: process.env.BUCKET, Key: key})
    return await getSignedUrl(s3client, command)
}

export const createGetPresignedUrl = async (key:string) => {
    const input: GetObjectCommandInput = { Bucket: process.env.BUCKET, Key:key }
    const command = new GetObjectCommand(input)

    return await getSignedUrl(s3client, command)
}

export const deleteRecordings = async (keys:string[]) => {

    const Keys = keys.map(key=>({Key:key}))

    const input: DeleteObjectsCommandInput = { Bucket: process.env.BUCKET, Delete:{Objects:[...Keys]} }
    const command = new DeleteObjectsCommand(input)

    await s3client.send(command)
}

export const getAudioFileNamesFromStorage = async (lessonId: number) => {
    const req: ListObjectsV2Request = {
        Bucket: process.env.BUCKET,
        Prefix: `${lessonId}/`
    }

    const listcommand = new ListObjectsV2Command(req)

    const response = await s3client.send(listcommand)

    if (!response.Contents) return new Set<string | undefined>()

    const listofKeys = response.Contents?.map(item => item.Key)

    const set = new Set(listofKeys)

    return set
}

export const getAudioFileFromStorage = async (lessonId: number, soundUrl: string) => {
    const input: GetObjectCommandInput = { Bucket: process.env.BUCKET, Key: `${lessonId}/${soundUrl}` }
    const command = new GetObjectCommand(input)

    return await getSignedUrl(s3client, command)
}

export const deleteAudioFilesFromStorage = async (lessonId: number, soundUrls: string[]) => {

    const toBeDeleted: DeleteObjectsCommandInput = {
        Bucket: process.env.BUCKET,
        Delete: {
            Objects: soundUrls.map(soundUrl => ({ Key: `${lessonId}/${soundUrl}` }))
        }
    }

    const command = new DeleteObjectsCommand(toBeDeleted)

    return await s3client.send(command)
}