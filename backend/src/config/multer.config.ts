import type { Request } from "express";
import type { FileFilterCallback } from "multer";

import multer from "multer";
import { storage } from "./cloudinary.config.js";

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedMimeTypes = [
    // Images
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "image/heic",
    // Videos
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
    "video/webm",
    // Documents
    "application/pdf",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only standard images, videos, and PDFs are allowed.",
      ),
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
});
