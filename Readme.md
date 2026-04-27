# Content Broadcasting Backend

This is a backend system where teachers upload content and principals review and approve it. Only approved content is displayed to users.

The system includes **subject-wise scheduling**, where content rotates dynamically based on time, order, and duration. Each subject runs its own independent rotation cycle.

---

## Features

* JWT Authentication & Role-Based Access Control (RBAC)
* Content Upload (local storage using Multer)
* Approval Workflow (Principal can approve/reject)
* Subject-wise Content Scheduling
* Time-based Rotation Logic (core feature)

---

## Tech Stack

* Node.js
* Express.js
* PostgreSQL

---

## 📅 Date & Time Standards

To ensure the scheduling engine remains deterministic across different timezones, the API strictly follows **ISO 8601** standards for all timestamp inputs.

* **Required Format:** `YYYY-MM-DDTHH:mm:ss.sssZ`
* **Example:** `2026-04-27T10:00:00.000Z`
* **Note:** The `Z` suffix (UTC) is mandatory to prevent rotation offsets between the local client and the cloud database.

Example
```
{
  "start_time": "2026-04-27T10:00:00.000Z",
  "end_time": "2026-04-27T22:00:00.000Z",
  "duration": 15
}
```

---

## Project Structure

```text
├── src/
│   ├── config/             # Database & Multer configurations
│   ├── constants/          # System-wide Enums (Roles, Subjects)
│   ├── controllers/        # Request handling & Response parsing
│   ├── db/                 # Database connection & pooling logic
│   ├── middlewares/        # JWT Auth, Role validation, Error handling
│   ├── models/             # Data access layer (SQL Queries)
│   ├── routes/             # API Route definitions
│   ├── services/           # Core business logic & rotation engine
│   ├── utils/              # Helper functions & AppError class
│   ├── app.js              # Express application setup
│   └── server.js           # Server entry point
├── uploads/                # Root media storage
├── .env                    # Environment variables
├── architecture-notes.txt  # Project technical notes
├── package.json            # Dependencies & Scripts
└── Readme.md               # Documentation

---

## Setup Instructions

1. Clone the repository

2. Install dependencies

```
npm install
```

3. Create a `.env` file in root:

```
PORT=3000
DATABASE_URL=your_postgres_connection_url
JWT_SECRET=your_secret_key
```

4. Setup database

```
psql -U postgres -d your_db -f src/db/schema.sql
```

5. Run the project

```
npm run dev
```

---
## API Overview

Base URL: /api

### Auth
- POST /api/auth/register → Register user
- POST /api/auth/login → Login user

---

### Content (Teacher Only)
- POST /api/content/upload → Upload content (with file)
- POST /api/content/schedule/:content_id → Set schedule (order, duration)
- GET /api/content/my-uploads → Get teacher's uploaded content

### Public
- GET /api/content/live/:teacher_id → Get currently active content (subject-wise)

---

### Approval (Principal Only)
- PATCH /api/approve/:content_id → Approve or reject content
- GET /api/approve/pending → Get pending content
- GET /api/approve/all → Get all content
---

## Scheduling / Rotation Logic (Core)

* Only approved content is considered
* Content must be within `start_time` and `end_time`
* Content is grouped by subject
* Each subject runs its own rotation

Core logic:

```
timeElapsed = (currentTime - startTime) % totalDuration
```

This determines which content is active at a given time.

---

## Database Design

Tables used:

* users
* content
* content_slots
* content_schedule

Design decisions:

* Separation of content and scheduling
* Use of foreign keys for relationships
* CHECK constraints for roles, status, subjects

---

## Middleware Usage

* auth.middleware.js → JWT validation
* role-based authorization
* multer → file upload handling
* global error handler

---

## Scalability (Planned)

* Redis caching
* Rate limiting
* Cloud storage (S3)
* Background jobs (queues)
* Pagination & filtering

---

## Notes

* Files are currently stored locally in `uploads/`
* Upload directory is created automatically at runtime
* Advanced features are identified but not implemented yet