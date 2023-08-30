import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	created_at: integer('created_at', { mode: 'timestamp' }).default(
		sql`(strftime('%s', 'now'))`,
	),
	update_at: integer('updated_at', { mode: 'timestamp' }).default(
		sql`(strftime('%s', 'now'))`,
	),
	first_name: text('first_name'),
	last_name: text('last_name'),
	user_name: text('username', { length: 32 }).notNull().unique(),
	email: text('email').notNull(),
})
export const insert_user_schema = createInsertSchema(user)
export const select_user_schema = createSelectSchema(user)

export const user_key = sqliteTable('user_key', {
	id: text('id').primaryKey(),
	created_at: integer('created_at', { mode: 'timestamp' }).default(
		sql`(strftime('%s', 'now'))`,
	),
	updated_at: integer('updated_at', { mode: 'timestamp' }).default(
		sql`(strftime('%s', 'now'))`,
	),
	user_id: text('user_id')
		.notNull()
		.references(() => user.id),
	hashed_password: text('hashed_password'),
})
export const insert_user_key_schema = createInsertSchema(user_key)
export const select_user_key_schema = createSelectSchema(user_key)

export const user_session = sqliteTable('user_session', {
	id: text('id').primaryKey(),
	created_at: integer('created_at', { mode: 'timestamp' }).default(
		sql`(strftime('%s', 'now'))`,
	),
	updated_at: integer('updated_at', { mode: 'timestamp' }).default(
		sql`(strftime('%s', 'now'))`,
	),
	user_id: text('user_id')
		.notNull()
		.references(() => user.id),
	active_expires: integer('active_expires').notNull(),
	idle_expires: integer('idle_expires').notNull(),
})
export const insert_user_session_schema =
	createInsertSchema(user_session)
export const select_user_session_schema =
	createSelectSchema(user_session)

// Contacts Table Schema
export const contacts = sqliteTable('contacts', {
	contact_id: integer('contact_id').primaryKey(),
	user_id: text('user_id')
		.notNull()
		.references(() => user.id),
	name: text('name').notNull(),
	relationship: text('relationship'),
	birthday: integer('birthday', { mode: 'timestamp' }),
	industry: text('industry'),
	location: text('location'),
	vip: integer('vip').default(0),
	last_update: integer('last_update', { mode: 'timestamp' }),
	last_contacted: integer('last_contacted', { mode: 'timestamp' }),
	status: text('status').default('All Good'),
})

export const insert_contacts_schema = createInsertSchema(contacts)
export const select_contacts_schema = createSelectSchema(contacts)

// Interactions Table Schema
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

// Background Table Schema
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

// ContactInfo Table Schema
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
