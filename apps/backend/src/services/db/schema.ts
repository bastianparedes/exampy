import { timestamp, pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const Users = pgTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
});

export const Exams = pgTable('exams', {
  id: serial('id').notNull().primaryKey(),
  url: text('url').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  userId: integer('user_id')
    .notNull()
    .references(() => Users.id),
});

// export const usersRelations =
