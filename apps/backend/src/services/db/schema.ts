import { timestamp, pgTable, serial, date, varchar, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey().unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  dateOfBirth: date('date_of_birth').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const Exams = pgTable('exams', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  texCode: text('tex_code').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});
