import {
	index,
	integer,
	sqliteTable,
	text,
} from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { industry_type } from './industry_type'
import { location_type } from './location_type'
import { relationship_type } from './relationship_type'
import { status_type } from './status_type'
import { user } from './user'

export const contacts = sqliteTable(
	'contacts',
	{
		contact_id: integer('contact_id').primaryKey(),
		user_id: text('user_id')
			.notNull()
			.references(() => user.id),
		name: text('name').notNull(),
		relationship_id: integer('relationship_id').references(
			() => relationship_type.id,
		),
		birthday: integer('birthday', { mode: 'timestamp' }),
		industry_id: integer('industry_id').references(
			() => industry_type.id,
		),
		location_id: integer('location_id').references(
			() => location_type.id,
		),
		vip: integer('vip', { mode: 'boolean' }).default(false),
		last_update: integer('last_update', { mode: 'timestamp' }),
		last_contacted: integer('last_contacted', { mode: 'timestamp' }),
		status_id: integer('status_id').references(() => status_type.id),
	},
	// Indexes
	(table) => {
		return {
			user_id_idx: index('user_id_idx').on(table.user_id),
		}
	},
)
export const insert_contacts_schema = createInsertSchema(contacts)
export const select_contacts_schema = createSelectSchema(contacts)
