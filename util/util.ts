export const removeExtention = (fileName: string) => {
    const periodIndex = fileName.lastIndexOf(".")

    return fileName.slice(0, periodIndex)
}