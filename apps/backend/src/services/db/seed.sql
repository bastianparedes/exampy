CREATE TABLE IF NOT EXISTS "users" (
  "id" INTEGER PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "exams" (
  "id" SERIAL PRIMARY KEY,
  "url" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "user_id" INTEGER NOT NULL,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id")
);
