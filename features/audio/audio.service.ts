import { createPostPresignedUrl, createGetPresignedUrl, deleteRecordings } from "../../config/s3client.config.ts"
import { Recording } from "./audio.model.ts"

export const addPostPresignedUrl = async (key: string): Promise<string> => {
    return await createPostPresignedUrl(key)
}

export const addGetPresignedUrl = async (key: string): Promise<string> => {
    return await createGetPresignedUrl(key)
}

export const deleteFromStorage = async (keys: string[]) => {
    await deleteRecordings(keys)
}

export const attachGetPresignedUrls= async (recordings: Recording[]) => {
    return Promise.all(recordings.map(async (recording) => {
        const url = await createGetPresignedUrl(recording.key)
        return { ...recording, url }
    }))
}