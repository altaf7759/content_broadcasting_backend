import multer from "multer";
import path from "path"
import { FILE_TYPES, LIMITS } from "../constants/enums.js";
import AppError from "../utils/appError.js";

const storage = multer.diskStorage({
      destination: (req, file, cb) => {
            cb(null, "uploads/");
      },
      filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
      }
});

const fileFilter = (req, file, cb) => {
      const allowedMimeTypes = Object.values(FILE_TYPES);

      if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
      } else {
            cb(new AppError("Invalid file type. Only JPG, PNG, and GIF are allowed.", 400), false);
      }
};

export const upload = multer({
      storage: storage,
      fileFilter: fileFilter,
      limits: {
            fileSize: LIMITS.MAX_FILE_SIZE
      }
});