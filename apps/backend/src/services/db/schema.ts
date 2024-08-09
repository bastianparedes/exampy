import { timestamp, pgTable, serial, varchar, text, boolean } from 'drizzle-orm/pg-core';

export const Users = pgTable('users', {
  id: serial('id').primaryKey().unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  verified: boolean('verified').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow()
});

export const Exams = pgTable('exams', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  texCode: text('tex_code').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});
