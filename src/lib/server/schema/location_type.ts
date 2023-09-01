import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const location_type = sqliteTable('location_type', {
	id: integer('id').primaryKey(),
	location: text('location').notNull().unique(),
})

export const insert_location_type_schema =
	createInsertSchema(location_type)
export const select_location_type_schema =
	createSelectSchema(location_type)
