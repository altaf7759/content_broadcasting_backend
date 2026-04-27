// src/models/content.model.js
import pool from "../config/db.js";
import { CONTENT_QUERIES } from "./queries.js";

export const Content = {
      async findById(id) {
            const result = await pool.query(CONTENT_QUERIES.FIND_BY_ID, [id]);
            return result.rows[0];
      },

      async findByTeacherId(teacherId) {
            const { rows } = await pool.query(CONTENT_QUERIES.FIND_BY_TEACHER_ID, [teacherId]);
            return rows;
      },

      async updateStatus(contentId, data) {
            const values = [data.status, data.rejectionReason, data.approvedBy, data.approvedAt, contentId];
            const { rows } = await pool.query(CONTENT_QUERIES.UPDATE_STATUS, values);
            return rows[0];
      },

      async create(data) {
            const values = [
                  data.title, data.description, data.subject, data.filePath,
                  data.fileType, data.fileSize, data.uploadedBy, data.status
            ];
            const { rows } = await pool.query(CONTENT_QUERIES.CREATE, values);
            return rows[0];
      },

      async findAll() {
            const { rows } = await pool.query(CONTENT_QUERIES.FIND_ALL);
            return rows;
      },

      async findByStatus(status) {
            const { rows } = await pool.query(CONTENT_QUERIES.FIND_BY_STATUS, [status]);
            return rows;
      }
};