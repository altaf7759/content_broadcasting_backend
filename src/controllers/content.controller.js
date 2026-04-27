import AppError from "../utils/AppError.js";
import {
      uploadContent,
      getTeacherContent
} from "../services/content.services.js";
import {
      finalizeSchedule,
      getTeacherLiveBroadcast
} from "../services/scheduling.services.js"

export async function createContent(req, res, next) {
      try {
            if (!req.file) {
                  throw new AppError("No file uploaded. Please select an image.", 400);
            }

            const { title, subject } = req.body;
            if (!title || !subject) {
                  throw new AppError("Title and Subject are required", 400);
            }

            const content = await uploadContent(req.user.id, req.body, req.file);

            res.status(201).json({
                  success: true,
                  message: "Content uploaded successfully and is pending approval.",
                  data: content
            });
      } catch (error) {
            next(error);
      }
}

export async function setContentSchedule(req, res, next) {
      try {
            const { content_id } = req.params;
            const { start_time, end_time, duration } = req.body;

            if (!start_time || !end_time || !duration) {
                  throw new AppError("Missing required scheduling fields: start_time, end_time, duration", 400);
            }

            const result = await finalizeSchedule(content_id, req.user.id, req.body);

            res.status(200).json({
                  success: true,
                  message: "Content scheduled successfully. It will rotate within the defined window.",
                  data: result
            });
      } catch (error) {
            next(error);
      }
}

export async function getLiveContentByTeacher(req, res, next) {
      try {
            const { teacher_id } = req.params;
            const result = await getTeacherLiveBroadcast(teacher_id);

            if (!result || !result.live) {
                  return res.status(200).json({
                        success: true,
                        message: "No content available",
                        data: null
                  });
            }

            res.status(200).json({
                  success: true,
                  data: result.data
            });
      } catch (error) {
            next(error);
      }
}

export async function getMyContent(req, res, next) {
      try {
            const teacherId = req.user.id;
            const content = await getTeacherContent(teacherId);

            res.status(200).json({
                  success: true,
                  count: content.length,
                  data: content
            });
      } catch (error) {
            next(error);
      }
}
