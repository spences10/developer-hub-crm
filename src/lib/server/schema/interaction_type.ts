import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const interaction_type = sqliteTable('interaction_type', {
	id: integer('id').primaryKey(),
	type: text('type').notNull().unique(),
})

export const insert_interaction_type_schema =
	createInsertSchema(interaction_type)
export const select_interaction_type_schema =
	createSelectSchema(interaction_type)
