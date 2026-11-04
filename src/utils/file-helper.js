import fs from "fs/promises";

export const deleteUploadedFile = async (file) => {
    if (!file?.path) return;

    try {
        await fs.unlink(file.path);
    } catch (error) {
        if (error.code !== "ENOENT") {
            throw error;
        }
    }
};