import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const industry_type = sqliteTable('industry_type', {
	id: integer('id').primaryKey(),
	type: text('type').notNull().unique(),
})

export const insert_industry_type_schema =
	createInsertSchema(industry_type)
export const select_industry_type_schema =
	createSelectSchema(industry_type)
