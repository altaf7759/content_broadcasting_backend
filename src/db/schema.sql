CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK (role IN ('teacher', 'principal')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT CHECK (subject IN ('maths', 'science', 'english')) NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INT,
  uploaded_by INT REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  rejection_reason TEXT,
  approved_by INT REFERENCES users(id),
  approved_at TIMESTAMP,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_slots (
  id SERIAL PRIMARY KEY,
  subject TEXT CHECK (subject IN ('maths', 'science', 'english')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_schedule (
  id SERIAL PRIMARY KEY,
  content_id INT REFERENCES content(id) ON DELETE CASCADE,
  slot_id INT REFERENCES content_slots(id) ON DELETE CASCADE,
  rotation_order INT NOT NULL,
  duration INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);