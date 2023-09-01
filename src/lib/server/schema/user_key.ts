import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { user } from './user'

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
