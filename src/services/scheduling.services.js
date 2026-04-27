import { Content } from "../models/content.model.js";
import { Schedule } from "../models/schedule.model.js";
import AppError from "../utils/appError.js";
import { CONTENT_STATUS } from "../constants/enums.js";

export async function finalizeSchedule(contentId, userId, payload) {
      const { start_time, end_time, duration } = payload;
      const now = new Date();

      const content = await Content.findById(contentId);
      if (!content) throw new AppError("Content not found", 404);

      // Verify ownership
      if (content.uploaded_by !== userId) {
            throw new AppError("You are not authorized to schedule this content", 403);
      }

      // Check approval status
      if (content.status !== CONTENT_STATUS.APPROVED) {
            throw new AppError("Content must be approved by the Principal before scheduling", 400);
      }

      // Check if already scheduled
      const alreadyScheduled = await Schedule.isAlreadyScheduled(contentId);
      if (alreadyScheduled) {
            throw new AppError("This content is already scheduled.", 400);
      }

      const start = new Date(start_time);
      const end = new Date(end_time);

      // Time sequence validation
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new AppError("Invalid date format provided", 400);
      }

      if (duration <= 0) {
            throw new AppError("Duration must be a positive number", 400);
      }

      if (start < now) {
            throw new AppError("Start time cannot be in the past", 400);
      }

      if (start >= end) {
            throw new AppError("Start time must be before end time", 400);
      }

      // Check if the duration (in seconds/minutes) actually fits in the window
      const windowInMinutes = (end - start) / (1000 * 60);
      if (duration > windowInMinutes) {
            throw new AppError("Duration cannot be longer than the total time window", 400);
      }

      return await Schedule.createSchedule({
            contentId,
            startTime: start,
            endTime: end,
            duration: duration
      });
}

export async function getTeacherLiveBroadcast(teacherId) {
      const liveItems = await Schedule.getLiveContentByTeacher(teacherId);

      if (!liveItems || liveItems.length === 0) {
            return { live: false };
      }

      return {
            live: true,
            data: liveItems
      };
}