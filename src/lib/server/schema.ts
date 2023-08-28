import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(
		sql`(strftime('%s', 'now'))`,
	),
	updateAt: integer('updated_at', { mode: 'timestamp' }).default(
		sql`(strftime('%s', 'now'))`,
	),
	firstName: text('first_name'),
	lastName: text('last_name'),
	userName: text('username', { length: 32 }).notNull().unique(),
	email: text('email').notNull(),
})
export const insertUserSchema = createInsertSchema(user)
export const selectUserSchema = createSelectSchema(user)

export const userKey = sqliteTable('user_key', {
	id: text('id').primaryKey(),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(
		sql`(strftime('%s', 'now'))`,
	),
	updateAt: integer('updated_at', { mode: 'timestamp' }).default(
		sql`(strftime('%s', 'now'))`,
	),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	hashedPassword: text('hashed_password'),
})
export const insertUserKeySchema = createInsertSchema(userKey)
export const selectUserKeySchema = createSelectSchema(userKey)

export const userSession = sqliteTable('user_session', {
	id: text('id').primaryKey(),
	createdAt: integer('created_at', { mode: 'timestamp' }).default(
		sql`(strftime('%s', 'now'))`,
	),
	updateAt: integer('updated_at', { mode: 'timestamp' }).default(
		sql`(strftime('%s', 'now'))`,
	),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	activeExpires: integer('active_expires').notNull(),
	idleExpires: integer('idle_expires').notNull(),
})
export const insertUserSessionSchema = createInsertSchema(userSession)
export const selectUserSessionSchema = createSelectSchema(userSession)

// Contacts Table Schema
export const contacts = sqliteTable('contacts', {
	contact_id: integer('contact_id').primaryKey(),
	name: text('name').notNull(),
	relationship: text('relationship'),
	birthday: text('birthday'),
	industry: text('industry'),
	location: text('location'),
	vip: integer('vip').default(0),
	last_update: text('last_update'),
	last_contacted: text('last_contacted'),
	status: text('status').default('All Good'),
})

export const insertContactsSchema = createInsertSchema(contacts)
export const selectContactsSchema = createSelectSchema(contacts)

// Interactions Table Schema
export const interactions = sqliteTable('interactions', {
	interaction_id: integer('interaction_id').primaryKey(),
	contact_id: integer('contact_id')
		.notNull()
		.references(() => contacts.contact_id),
	type: text('type'),
	date: text('date').notNull(),
	notes: text('notes'),
})

export const insertInteractionsSchema =
	createInsertSchema(interactions)
export const selectInteractionsSchema =
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

export const insertBackgroundSchema = createInsertSchema(background)
export const selectBackgroundSchema = createSelectSchema(background)

// ContactInfo Table Schema
export const contactInfo = sqliteTable('contact_info', {
	contact_info_id: integer('contact_info_id').primaryKey(),
	contact_id: integer('contact_id')
		.notNull()
		.references(() => contacts.contact_id),
	main_app: text('main_app'),
	email: text('email'),
	phone_number: text('phone_number'),
	social_links: text('social_links'),
})

export const insertContactInfoSchema = createInsertSchema(contactInfo)
export const selectContactInfoSchema = createSelectSchema(contactInfo)
