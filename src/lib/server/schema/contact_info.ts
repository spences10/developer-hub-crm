import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { contacts } from './contacts'

export const contact_info = sqliteTable('contact_info', {
	contact_info_id: integer('contact_info_id').primaryKey(),
	contact_id: integer('contact_id')
		.notNull()
		.references(() => contacts.contact_id),
	main_app: text('main_app'),
	email: text('email'),
	phone_number: text('phone_number'),
	social_links: text('social_links'),
})
export const insert_contact_info_schema =
	createInsertSchema(contact_info)
export const select_contact_info_schema =
	createSelectSchema(contact_info)
