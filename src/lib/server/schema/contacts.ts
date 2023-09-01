import {
	index,
	integer,
	sqliteTable,
	text,
} from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { user } from './user'

export const contacts = sqliteTable(
	'contacts',
	{
		contact_id: integer('contact_id').primaryKey(),
		user_id: text('user_id')
			.notNull()
			.references(() => user.id),
		name: text('name').notNull(),
		relationship: text('relationship'),
		birthday: integer('birthday', { mode: 'timestamp' }),
		industry: text('industry'),
		location: text('location'),
		vip: integer('vip', { mode: 'boolean' }).default(false),
		last_update: integer('last_update', { mode: 'timestamp' }),
		last_contacted: integer('last_contacted', { mode: 'timestamp' }),
		status: text('status').default('All Good'),
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
