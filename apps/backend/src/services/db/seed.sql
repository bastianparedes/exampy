CREATE TABLE IF NOT EXISTS "users" (
  "id" INTEGER PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "exams" (
  "name" TEXT  NOT NULL PRIMARY KEY,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "user_id" INTEGER DEFAULT NULL,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id")
);