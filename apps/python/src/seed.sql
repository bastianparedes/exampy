CREATE TABLE IF NOT EXISTS "users" (
  "id" INTEGER NOT NULL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "exercises" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "last_modified_date" TIMESTAMP WITH TIME ZONE NOT NULL,
  "user_id" INTEGER NOT NULL,
  FOREIGN KEY ("user_id") REFERENCES "users" ("id")
);
