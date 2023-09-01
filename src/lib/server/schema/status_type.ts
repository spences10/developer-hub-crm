import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const status_type = sqliteTable('status_type', {
	id: integer('id').primaryKey(),
	status: text('status').notNull().unique(),
})

export const insert_status_type_schema =
	createInsertSchema(status_type)
export const select_status_type_schema =
	createSelectSchema(status_type)
