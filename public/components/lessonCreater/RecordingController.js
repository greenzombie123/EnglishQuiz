export class RecordingController {
    constructor(host) {
        this.recordings = [];
        this.slideRecordingIds = [];
        this.deleteRecordingIds = [];
        // Store references to the host
        this.host = host;
        // Register for lifecycle updates
        this.host.addController(this);
    }
    hostConnected() { }
    hostDisconnected() { }
    setRecording(recording) {
        this.recordings = [...this.recordings, recording];
        if (!this.slideRecordingIds.includes(recording.id))
            this.slideRecordingIds = [...this.slideRecordingIds, recording.id];
        this.host.requestUpdate();
    }
    removeRecording(recordingId) {
        this.recordings = this.recordings.filter(recording => recording.id !== recordingId);
        this.deleteRecordingIds = [...this.deleteRecordingIds, recordingId];
        this.host.requestUpdate();
    }
    removeRecordingFromSlides(slides, recordingId) {
        return slides.map(slide => {
            const slideRecordingIds = [...slide.recordings];
            const newSlideRecordingIds = slideRecordingIds.filter(slideRecordingId => slideRecordingId !== recordingId);
            return { ...slide, recordings: newSlideRecordingIds };
        });
    }
    async retrieveRecordings(slides) {
        const recordingIds = this.getRecordingIds(slides);
        const recordings = await this.getRecordings(recordingIds);
        const recordingsWithFile = await this.getRecordingFiles(recordings);
        this.slideRecordingIds = [...recordingIds];
        this.recordings = [...recordingsWithFile];
        this.host.requestUpdate();
        console.log("Recordings successfully downloaded");
    }
    // Remove old unattached recordings and attach the put presigned urls to the remaining recordings
    // Find unattached recordings and put them into delete recording ids array
    async prepareRecordings(slides) {
        const recordings = [...this.recordings];
        const attachedNewRecordings = this.getAttachedNewRecordings(slides, recordings);
        if (attachedNewRecordings.length === 0)
            return [];
        const finalRecordings = await this.attachPutPresignedUrls(attachedNewRecordings);
        return finalRecordings;
    }
    async deleteRecordingFromStorage() {
        const deleteIds = [...this.deleteRecordingIds];
        if (deleteIds.length === 0)
            return;
        const url = new URL("http://localhost:3000/audio/storage");
        deleteIds.forEach(deleteId => {
            url.searchParams.append('id', deleteId);
        });
        try {
            await fetch(url, { method: "DELETE" });
        }
        catch (error) {
            console.log(error);
            throw new Error("something wrong");
        }
    }
    async deleteRecordingsFromDatabase() {
        const deleteIds = [...this.deleteRecordingIds];
        if (deleteIds.length === 0)
            return;
        const url = new URL("http://localhost:3000/audio");
        deleteIds.forEach(deleteId => {
            url.searchParams.append('id', deleteId);
        });
        await fetch(url, { method: "DELETE" });
    }
    async sendRecordingsToStorage(recordings) {
        if (recordings.length === 0)
            return;
        await Promise.all(recordings.map(async (recording) => {
            return await fetch(recording.url, {
                method: "PUT",
                body: recording.file
            });
        }));
    }
    async sendRecordingsToDatabase(recordings) {
        if (recordings.length === 0)
            return;
        const data = { recordings };
        await fetch("/audio", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    processUnattachedRecordingsForDeletion(slides) {
        const recordings = [...this.recordings];
        const slideRecordingIds = this.getRecordingIds(slides);
        const unattachedRecordingIds = recordings.filter(recording => !slideRecordingIds.includes(recording.id)).map(recording => recording.id);
        this.deleteRecordingIds = [...this.deleteRecordingIds, ...unattachedRecordingIds];
    }
    getRecordingIds(slides) {
        const recordings = slides.map(slide => slide.recordings);
        return recordings.reduce((pre, cur) => {
            const ids = cur.filter(recording => !pre.includes(recording));
            return [...pre, ...ids];
        }, []);
    }
    async getRecordings(recordingIds) {
        const url = new URL("http://localhost:3000/audio");
        recordingIds.forEach(recordingId => {
            url.searchParams.append('id', recordingId);
        });
        const response = await fetch(url);
        const recordings = await response.json();
        return recordings;
    }
    async getRecordingFiles(recordings) {
        try {
            return await Promise.all(recordings.map(async (recording) => {
                const response = await fetch(recording.url);
                const file = await response.blob();
                return { ...recording, file: new File([file], recording.name) };
            }));
        }
        catch (error) {
            console.error(error);
            throw new Error("Couldn't get recordings from storage");
        }
    }
    async attachPutPresignedUrls(recordings) {
        const newRecordings = recordings.filter(recording => recording.isNew);
        try {
            return await Promise.all(newRecordings.map(async (recording) => {
                const response = await fetch(`/audio/storage?key=${recording.key}`);
                const presignedUrl = await response.json();
                return { ...recording, url: presignedUrl };
            }));
        }
        catch (error) {
            console.log(error);
            throw new Error("something wrong");
        }
    }
    getAttachedNewRecordings(slides, recordings) {
        const slideRecordingIds = this.getRecordingIds(slides);
        return recordings.filter(recording => slideRecordingIds.includes(recording.id) && recording.isNew);
    }
}
//# sourceMappingURL=RecordingController.js.map