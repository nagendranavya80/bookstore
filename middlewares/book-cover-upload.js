import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fileTypeFromFile } from "file-type";
import multer from "multer";

const coverDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../public/uploads",
);
const extensionsByMimeType = {
    "image/avif": ".avif",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
};

mkdirSync(coverDirectory, { recursive: true });

const upload = multer({
    storage: multer.diskStorage({
        destination: coverDirectory,
        filename: (req, file, callback) => {
            callback(
                null,
                `${randomUUID()}${extensionsByMimeType[file.mimetype]}`,
            );
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
    },
    fileFilter: (req, file, callback) => {
        if (!extensionsByMimeType[file.mimetype]) {
            return callback(
                new Error("Choose a JPG, PNG, WebP, or AVIF image."),
            );
        }
        return callback(null, true);
    },
});

const validateCoverImage = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    let detectedType;
    try {
        detectedType = await fileTypeFromFile(req.file.path);
    } catch (error) {
        try {
            await unlink(req.file.path);
        } catch (cleanupError) {
            console.error("Could not remove invalid cover upload:", cleanupError);
        }
        return next(error);
    }

    if (
        !detectedType ||
        detectedType.mime !== req.file.mimetype ||
        !extensionsByMimeType[detectedType.mime]
    ) {
        try {
            await unlink(req.file.path);
        } catch (error) {
            return next(error);
        }
        return res.status(400).json({
            success: false,
            message: "The uploaded file is not a supported image.",
        });
    }

    return next();
};

const receiveBookCover = (req, res, next) => {
    upload.single("coverImage")(req, res, (error) => {
        if (error) {
            const isRejectedImage =
                error.message === "Choose a JPG, PNG, WebP, or AVIF image.";
            const isFileTooLarge =
                error.code === "LIMIT_FILE_SIZE" ||
                error.message === "File too large";
            const status =
                isFileTooLarge
                    ? 413
                    : error instanceof multer.MulterError || isRejectedImage
                      ? 400
                      : 500;
            return res.status(status).json({
                success: false,
                message:
                    status === 500
                        ? "Could not save the uploaded cover image."
                        : error.message,
            });
        }
        return validateCoverImage(req, res, next);
    });
};

export default receiveBookCover;
