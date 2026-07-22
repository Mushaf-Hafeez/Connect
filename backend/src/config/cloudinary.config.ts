import type { Request } from "express";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import { config } from "dotenv";
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Request, file: Express.Multer.File) => ({
    folder: process.env.CLOUDINARY_FOLDER_NAME,
    allowed_formats: [
      // Images
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "heic",
      // Videos
      "mp4",
      "mov",
      "avi",
      "mkv",
      "webm",
      // Documents
      "pdf",
    ],
    transformations: [{ width: 1280, height: 720 }, { quality: "auto" }],
    resource_type: "auto",
  }),
});
