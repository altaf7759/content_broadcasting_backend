// User Queries
export const USER_QUERIES = {
  FIND_BY_EMAIL: 'SELECT * FROM users WHERE email = $1;',
  CREATE_USER: `
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role;
    `
};

// Content Queries
export const CONTENT_QUERIES = {
  FIND_BY_ID: `SELECT * FROM content WHERE id = $1`,
  FIND_BY_TEACHER_ID: `
        SELECT id, title, description, subject, status,
               rejection_reason, approved_at, created_at,
               file_path, file_type, file_size
        FROM content
        WHERE uploaded_by = $1
        ORDER BY created_at DESC;
    `,
  UPDATE_STATUS: `
        UPDATE content
        SET status = $1, rejection_reason = $2, approved_by = $3, approved_at = $4
        WHERE id = $5
        RETURNING *;
    `,
  CREATE: `
        INSERT INTO content (
            title, description, subject, file_path,
            file_type, file_size, uploaded_by, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `,
  FIND_ALL: `
        SELECT c.*, u.name as teacher_name
        FROM content c
        JOIN users u ON c.uploaded_by = u.id
        ORDER BY c.created_at DESC;
    `,
  FIND_BY_STATUS: `
        SELECT c.*, u.name as teacher_name
        FROM content c
        JOIN users u ON c.uploaded_by = u.id
        WHERE c.status = $1
        ORDER BY c.created_at DESC;
    `
};

// Subject Queries
export const SUBJECT_QUERIES = {
  FIND_BY_NAME: `SELECT id, subject FROM content_slots WHERE subject = $1;`,
  CREATE: `
        INSERT INTO content_slots (subject)
        VALUES ($1)
        RETURNING *;
    `
};

// Schedule Queries
export const SCHEDULE_QUERIES = {
  CHECK_EXISTS: 'SELECT id FROM content_schedule WHERE content_id = $1 LIMIT 1',
  UPDATE_CONTENT_WINDOW: `
        UPDATE content
        SET start_time = $1, end_time = $2
        WHERE id = $3
        RETURNING subject;
    `,
  GET_SLOT_ID: 'SELECT id FROM content_slots WHERE subject = $1',
  GET_NEXT_ROTATION_ORDER: `
        SELECT COALESCE(MAX(rotation_order), 0) + 1 as next_order
        FROM content_schedule WHERE slot_id = $1
    `,
  INSERT_SCHEDULE: `
        INSERT INTO content_schedule (content_id, slot_id, rotation_order, duration)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `,
  LIVE_BROADCAST_BY_TEACHER: `
        WITH active_pool AS (
            SELECT
                c.id, c.title, c.file_path, c.subject,
                s.duration, s.rotation_order,
                SUM(s.duration) OVER(PARTITION BY c.subject) as total_subject_cycle,
                SUM(s.duration) OVER(PARTITION BY c.subject ORDER BY s.rotation_order) - s.duration as start_in_cycle
            FROM content c
            JOIN content_schedule s ON c.id = s.content_id
            WHERE c.uploaded_by = $1
              AND c.status = 'approved'
              AND NOW() BETWEEN c.start_time AND c.end_time
        )
        SELECT id, title, file_path, subject, duration
        FROM active_pool
        WHERE (
            EXTRACT(EPOCH FROM (NOW())) / 60
            % total_subject_cycle
        ) >= start_in_cycle
        ORDER BY subject, rotation_order DESC;
    `
};