// Database type definitions for Developer Hub CRM

export interface Contact {
	id: string;
	user_id: string;
	name: string;
	email: string | null;
	phone: string | null;
	company: string | null;
	title: string | null;
	github_username: string | null;
	is_vip: number; // 0 or 1 (SQLite boolean)
	birthday: string | null; // YYYY-MM-DD format
	notes: string | null;
	last_contacted_at: number | null;
	created_at: number;
	updated_at: number;
}

export interface Interaction {
	id: string;
	contact_id: string;
	type: 'meeting' | 'call' | 'email' | 'message';
	note: string | null;
	created_at: number;
	updated_at: number;
}

export interface FollowUp {
	id: string;
	contact_id: string;
	due_date: number;
	note: string | null;
	completed: number; // 0 or 1 (SQLite boolean)
	completed_at: number | null;
	created_at: number;
	updated_at: number;
}

export interface SocialLink {
	id: string;
	contact_id: string;
	platform: string; // 'twitter', 'bluesky', 'linkedin', 'website', etc.
	url: string;
	created_at: number;
}

export interface UserPreferences {
	id: string;
	user_id: string;
	date_format: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY';
	time_format: '12h' | '24h';
	default_contact_sort:
		| 'name'
		| 'last_contacted'
		| 'recently_added'
		| 'company';
	default_follow_up_days: number;
	default_interaction_type:
		| 'meeting'
		| 'call'
		| 'email'
		| 'message'
		| null;
	created_at: number;
	updated_at: number;
}
