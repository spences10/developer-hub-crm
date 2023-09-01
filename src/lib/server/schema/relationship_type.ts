import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const relationship_type = sqliteTable('relationship_type', {
	id: integer('id').primaryKey(),
	type: text('type').notNull().unique(),
})

export const insert_relationship_type_schema =
	createInsertSchema(relationship_type)
export const select_relationship_type_schema =
	createSelectSchema(relationship_type)
