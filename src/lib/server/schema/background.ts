import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { contacts } from './contacts'

export const background = sqliteTable('background', {
	background_id: integer('background_id').primaryKey(),
	contact_id: integer('contact_id')
		.notNull()
		.references(() => contacts.contact_id),
	family: text('family'),
	company: text('company'),
	likes_dislikes: text('likes_dislikes'),
	misc_notes: text('misc_notes'),
})
export const insert_background_schema = createInsertSchema(background)
export const select_background_schema = createSelectSchema(background)
