import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { upload } from "../config/multer.js";
import { ROLES } from "../constants/enums.js";
import {
      createContent,
      setContentSchedule,
      getLiveContentByTeacher,
      getMyContent
} from "../controllers/content.controller.js";

export const contentRouter = express.Router();

contentRouter.get("/live/:teacher_id", getLiveContentByTeacher);

contentRouter.use(protect);
contentRouter.use(authorize(ROLES.TEACHER));

contentRouter.post("/upload", upload.single("file"), createContent);
contentRouter.post("/schedule/:content_id", setContentSchedule);
contentRouter.get("/my-uploads", getMyContent);