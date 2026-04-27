import { Content } from "../models/content.model.js";
import { Subject } from "../models/subject.model.js"
import { CONTENT_STATUS, SUBJECTS } from "../constants/enums.js";
import AppError from "../utils/AppError.js";

export async function uploadContent(userId, body, file) {
      const normalizedSubject = body.subject?.toLowerCase();
      const validSubjects = Object.values(SUBJECTS);

      if (!validSubjects.includes(normalizedSubject)) {
            throw new AppError(`Invalid subject. Must be one of: ${validSubjects.join(', ')}`, 400);
      }

      const existingSlot = await Subject.findSubject(normalizedSubject);

      if (!existingSlot) {
            await Subject.create(normalizedSubject);
      }

      const contentData = {
            title: body.title,
            description: body.description,
            subject: normalizedSubject,
            filePath: file.path,
            fileType: file.mimetype,
            fileSize: file.size,
            uploadedBy: userId,
            status: CONTENT_STATUS.PENDING
      };

      return await Content.create(contentData);
}

export async function getTeacherContent(teacherId) {
      return await Content.findByTeacherId(teacherId);
}