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
