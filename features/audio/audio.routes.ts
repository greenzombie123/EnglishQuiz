import { Router } from "express";
import { deleteRecordings, deleteRecordingsFromStorage, getPostPresignedUrl, getRecordingByKey, getRecordings, postRecordings } from "./audio.controller.ts";

export const audioRouter = Router()

// Either retrieve recordings by id or by key. 

audioRouter.get("/:key", getRecordingByKey)
audioRouter.get("/", getRecordings)

audioRouter.post("/", postRecordings)

audioRouter.get("/storage", getPostPresignedUrl)

audioRouter.delete("/", deleteRecordings)

audioRouter.delete("/storage", deleteRecordingsFromStorage)

