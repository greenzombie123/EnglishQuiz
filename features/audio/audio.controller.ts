import type { NextFunction, Request, Response } from "express";
import { Recording } from "./audio.model.ts";
import { addPostPresignedUrl, attachGetPresignedUrls, deleteFromStorage } from "./audio.service.ts";

export const getRecordings = async (
    req: Request<{}, {}, {}, { id: string[] }>,
    res: Response,
    next: NextFunction
) => {
    const recordingIds = req.query.id

    const recordings = await Recording.get(recordingIds)
    const recordingsWithUrl: Recording[] = await attachGetPresignedUrls(recordings)

    res.send(recordingsWithUrl)
}

export const getRecordingByKey = async (
    req: Request<{ key: string }>,
    res: Response,
    next: NextFunction
) => {
    const { key } = req.params

    const recording = await Recording.getByKey(key)
    const recordingsWithUrl: Recording[] = await attachGetPresignedUrls([recording])
    if (!recordingsWithUrl[0]) throw new Error("Yo!")

    res.send(recordingsWithUrl[0])
}

export const postRecordings = async (
    req: Request<{}, {}, { recordings: Recording[] }>,
    res: Response,
    next: NextFunction
) => {
    const { recordings } = req.body

    await Recording.post(recordings)

    res.end()
}

export const deleteRecordings = async (
    req: Request<{}, {}, {}, { id: string[] }>,
    res: Response,
    next: NextFunction
) => {
    const ids = req.query.id

    await Recording.delete(ids)

    res.end()
}

export const getPostPresignedUrl = async (
    req: Request<{}, {}, {}, { key: string }>,
    res: Response,
    next: NextFunction) => {

    const { key } = req.query

    const presignedUrl: string = await addPostPresignedUrl(key)

    res.json(presignedUrl)

}

export const deleteRecordingsFromStorage = async (
    req: Request<{}, {}, {}, { id: string[] }>,
    res: Response,
    next: NextFunction) => {

    const { id } = req.query

    const keys = await Recording.getKeys(id)
    await deleteFromStorage(keys)

    res.end()
}

