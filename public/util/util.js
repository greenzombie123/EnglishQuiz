export const removeExtention = (fileName) => {
    const periodIndex = fileName.lastIndexOf(".");
    return fileName.slice(0, periodIndex);
};
//# sourceMappingURL=util.js.map