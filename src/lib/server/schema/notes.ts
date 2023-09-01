import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { contacts } from './contacts'

export const notes = sqliteTable('notes', {
	id: integer('id').primaryKey(),
	contact_id: integer('contact_id').references(
		() => contacts.contact_id,
	),
	timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
	note: text('note').notNull(),
})

export const insert_notes_schema = createInsertSchema(notes)
export const select_notes_schema = createSelectSchema(notes)
