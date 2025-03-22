import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Helper for created_at and updated_at fields
const timestamps = {
	created_at: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER)`),
	updated_at: integer('updated_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER)`),
};

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	...timestamps,
});

export const userRelations = relations(user, ({ many }) => ({
	contacts: many(contact),
}));

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
});

// Contacts table
export const contact = sqliteTable('contact', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	name: text('name').notNull(),
	relationship: text('relationship'),
	birthday: integer('birthday', { mode: 'timestamp_ms' }),
	industry: text('industry'),
	location: text('location'),
	vip: integer('vip', { mode: 'boolean' })
		.notNull()
		.default(sql`0`),
	lastUpdate: integer('last_update', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`CAST((julianday('now') - 2440587.5) * 86400000 AS INTEGER)`),
	lastContacted: integer('last_contacted', { mode: 'timestamp_ms' }),
	status: text('status').notNull().default('active'),
	...timestamps,
});

export const contactRelations = relations(contact, ({ one, many }) => ({
	user: one(user, {
		fields: [contact.userId],
		references: [user.id],
	}),
	interactions: many(interaction),
	background: one(background),
	contactInfo: one(contactInfo),
}));

// Interactions table
export const interaction = sqliteTable('interaction', {
	id: text('id').primaryKey(),
	contactId: text('contact_id')
		.notNull()
		.references(() => contact.id),
	type: text('type').notNull(),
	date: integer('date', { mode: 'timestamp_ms' }).notNull(),
	notes: text('notes'),
	...timestamps,
});

export const interactionRelations = relations(interaction, ({ one }) => ({
	contact: one(contact, {
		fields: [interaction.contactId],
		references: [contact.id],
	}),
}));

// Background table (for VIPs)
export const background = sqliteTable('background', {
	id: text('id').primaryKey(),
	contactId: text('contact_id')
		.notNull()
		.references(() => contact.id),
	family: text('family'),
	company: text('company'),
	likesDislikes: text('likes_dislikes'),
	miscNotes: text('misc_notes'),
	...timestamps,
});

export const backgroundRelations = relations(background, ({ one }) => ({
	contact: one(contact, {
		fields: [background.contactId],
		references: [contact.id],
	}),
}));

// ContactInfo table (for VIPs)
export const contactInfo = sqliteTable('contact_info', {
	id: text('id').primaryKey(),
	contactId: text('contact_id')
		.notNull()
		.references(() => contact.id),
	mainApp: text('main_app'),
	email: text('email'),
	phoneNumber: text('phone_number'),
	socialLinks: text('social_links'), // JSON stored as TEXT
	...timestamps,
});

export const contactInfoRelations = relations(contactInfo, ({ one }) => ({
	contact: one(contact, {
		fields: [contactInfo.contactId],
		references: [contact.id],
	}),
}));

// Type inference
export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Contact = typeof contact.$inferSelect;
export type Interaction = typeof interaction.$inferSelect;
export type Background = typeof background.$inferSelect;
export type ContactInfo = typeof contactInfo.$inferSelect;

// Insert types
export type NewUser = typeof user.$inferInsert;
export type NewSession = typeof session.$inferInsert;
export type NewContact = typeof contact.$inferInsert;
export type NewInteraction = typeof interaction.$inferInsert;
export type NewBackground = typeof background.$inferInsert;
export type NewContactInfo = typeof contactInfo.$inferInsert;
