import { relations } from 'drizzle-orm';
import { timestamp, pgTable, text, integer } from 'drizzle-orm/pg-core';

export const Users = pgTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
});

export const Exams = pgTable('exams', {
  name: text('name').notNull().primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
  userId: integer('user_id')
    .default(null)
    .references(() => Users.id),
});

export const UsersRelations = relations(Users, ({ many }) => ({
  Posts: many(Exams),
}));

export const ExamsRelations = relations(Exams, ({ one }) => ({
  Users: one(Users, { fields: [Exams.userId], references: [Users.id] }),
}));
