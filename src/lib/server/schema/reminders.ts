import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { contacts } from "./contacts";

export const reminders = sqliteTable('reminders', {
  id: integer('id').primaryKey(),
  contact_id: integer('contact_id')
    .references(() => contacts.contact_id),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  message: text('message').notNull(),
});

export const insert_reminders_schema = createInsertSchema(reminders);
export const select_reminders_schema = createSelectSchema(reminders);
