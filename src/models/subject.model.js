import pool from "../config/db.js";
import { SUBJECT_QUERIES } from "./queries.js";

export const Subject = {
      async findSubject(subject) {
            const result = await pool.query(SUBJECT_QUERIES.FIND_BY_NAME, [subject]);
            return result.rows[0];
      },

      async create(subject) {
            const { rows } = await pool.query(SUBJECT_QUERIES.CREATE, [subject]);
            return rows[0];
      }
};