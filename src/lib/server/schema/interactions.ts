import { integer, sqliteTable } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { contacts } from './contacts'
import { interaction_type } from './interaction_type'
import { notes } from './notes'
import { reminders } from './reminders'

export const interactions = sqliteTable('interactions', {
	interaction_id: integer('interaction_id').primaryKey(),
	contact_id: integer('contact_id')
		.notNull()
		.references(() => contacts.contact_id),
	type_id: integer('type_id').references(() => interaction_type.id),
	date: integer('date', { mode: 'timestamp' }).notNull(),
	notes_id: integer('notes_id').references(() => notes.id),
	reminder_id: integer('reminder_id').references(() => reminders.id),
})
export const insert_interactions_schema =
	createInsertSchema(interactions)
export const select_interactions_schema =
	createSelectSchema(interactions)
