import { query } from '$app/server';
import { get_current_user_id } from '$lib/server/auth-helpers';
import { db } from '$lib/server/db';
import type { FollowUp, Interaction } from '$lib/types/db';

export const get_dashboard_stats = query(async () => {
	const user_id = await get_current_user_id();
	const now = Date.now();

	// Get contact stats
	const contact_stats = db
		.prepare(
			`
    SELECT COUNT(*) as total_contacts FROM contacts WHERE user_id = ?
  `,
		)
		.get(user_id) as { total_contacts: number };

	// Get interaction stats
	const interaction_stats = db
		.prepare(
			`
    SELECT COUNT(*) as total_interactions FROM interactions i
    INNER JOIN contacts c ON i.contact_id = c.id
    WHERE c.user_id = ?
  `,
		)
		.get(user_id) as { total_interactions: number };

	// Get follow-up stats
	const follow_up_stats = db
		.prepare(
			`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN completed = 0 AND due_date < ? THEN 1 ELSE 0 END) as overdue
    FROM follow_ups f
    INNER JOIN contacts c ON f.contact_id = c.id
    WHERE c.user_id = ?
  `,
		)
		.get(now, user_id) as {
		total: number;
		pending: number;
		overdue: number;
	};

	return {
		contacts: contact_stats.total_contacts,
		interactions: interaction_stats.total_interactions,
		follow_ups: {
			total: follow_up_stats.total,
			pending: follow_up_stats.pending,
			overdue: follow_up_stats.overdue,
		},
	};
});

export const get_dashboard_activity = query(async () => {
	const user_id = await get_current_user_id();

	// Get recent interactions
	const recent_interactions = db
		.prepare(
			`
    SELECT
      i.*,
      c.name as contact_name
    FROM interactions i
    INNER JOIN contacts c ON i.contact_id = c.id
    WHERE c.user_id = ?
    ORDER BY i.created_at DESC
    LIMIT 5
  `,
		)
		.all(user_id) as Array<Interaction & { contact_name: string }>;

	// Get upcoming follow-ups (next 7 days)
	const now = Date.now();
	const future = now + 7 * 24 * 60 * 60 * 1000;
	const upcoming_follow_ups = db
		.prepare(
			`
    SELECT
      f.*,
      c.name as contact_name
    FROM follow_ups f
    INNER JOIN contacts c ON f.contact_id = c.id
    WHERE c.user_id = ?
      AND f.completed = 0
      AND f.due_date BETWEEN ? AND ?
    ORDER BY f.due_date ASC
    LIMIT 5
  `,
		)
		.all(user_id, now, future) as Array<
		FollowUp & { contact_name: string }
	>;

	// Get overdue follow-ups
	const overdue_follow_ups = db
		.prepare(
			`
    SELECT
      f.*,
      c.name as contact_name
    FROM follow_ups f
    INNER JOIN contacts c ON f.contact_id = c.id
    WHERE c.user_id = ?
      AND f.completed = 0
      AND f.due_date < ?
    ORDER BY f.due_date ASC
  `,
		)
		.all(user_id, now) as Array<FollowUp & { contact_name: string }>;

	return {
		recent_interactions,
		upcoming_follow_ups,
		overdue_follow_ups,
	};
});
