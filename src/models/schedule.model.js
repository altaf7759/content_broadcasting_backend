import pool from "../config/db.js";
import { SCHEDULE_QUERIES } from "./queries.js";

export const Schedule = {
      async isAlreadyScheduled(contentId) {
            const { rows } = await pool.query(SCHEDULE_QUERIES.CHECK_EXISTS, [contentId]);
            return rows.length > 0;
      },

      async createSchedule(data) {
            const client = await pool.connect();
            try {
                  await client.query('BEGIN');

                  const contentRes = await client.query(SCHEDULE_QUERIES.UPDATE_CONTENT_WINDOW,
                        [data.startTime, data.endTime, data.contentId]);
                  const subject = contentRes.rows[0].subject;

                  const slotRes = await client.query(SCHEDULE_QUERIES.GET_SLOT_ID, [subject]);
                  const slotId = slotRes.rows[0].id;

                  const orderRes = await client.query(SCHEDULE_QUERIES.GET_NEXT_ROTATION_ORDER, [slotId]);
                  const nextOrder = orderRes.rows[0].next_order;

                  const scheduleRes = await client.query(SCHEDULE_QUERIES.INSERT_SCHEDULE, [
                        data.contentId, slotId, nextOrder, data.duration
                  ]);

                  await client.query('COMMIT');
                  return scheduleRes.rows[0];
            } catch (error) {
                  await client.query('ROLLBACK');
                  throw error;
            } finally {
                  client.release();
            }
      },

      async getLiveContentByTeacher(teacherId) {
            const { rows } = await pool.query(SCHEDULE_QUERIES.LIVE_BROADCAST_BY_TEACHER, [teacherId]);
            const uniqueSubjects = {};
            return rows.filter(item => {
                  if (!uniqueSubjects[item.subject]) {
                        uniqueSubjects[item.subject] = true;
                        return true;
                  }
                  return false;
            });
      }
};