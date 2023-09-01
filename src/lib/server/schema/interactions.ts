import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { contacts } from './contacts'

export const interactions = sqliteTable('interactions', {
	interaction_id: integer('interaction_id').primaryKey(),
	contact_id: integer('contact_id')
		.notNull()
		.references(() => contacts.contact_id),
	type: text('type'),
	date: integer('date', { mode: 'timestamp' }).notNull(),
	notes: text('notes'),
})
export const insert_interactions_schema =
	createInsertSchema(interactions)
export const select_interactions_schema =
	createSelectSchema(interactions)
