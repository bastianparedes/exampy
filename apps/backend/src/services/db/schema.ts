import { timestamp, pgTable, text } from 'drizzle-orm/pg-core';

export const Exams = pgTable('exams', {
  name: text('name').notNull().primaryKey(),
  createdAt: timestamp('created_at').defaultNow()
});
