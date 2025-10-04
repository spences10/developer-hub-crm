// Date utility functions for Developer Hub CRM

/**
 * Format a timestamp as a human-readable due date
 * Returns "Today", "Tomorrow", "Overdue: MM/DD/YYYY", or MM/DD/YYYY
 */
export function format_due_date(timestamp: number): string {
	const date = new Date(timestamp);
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	// Reset times to compare dates only
	const date_only = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
	);
	const today_only = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate(),
	);
	const tomorrow_only = new Date(
		tomorrow.getFullYear(),
		tomorrow.getMonth(),
		tomorrow.getDate(),
	);

	if (date_only.getTime() === today_only.getTime()) {
		return 'Today';
	} else if (date_only.getTime() === tomorrow_only.getTime()) {
		return 'Tomorrow';
	} else if (date_only < today_only) {
		return `Overdue: ${date.toLocaleDateString()}`;
	} else {
		return date.toLocaleDateString();
	}
}

/**
 * Check if a timestamp is in the past
 */
export function is_overdue(timestamp: number): boolean {
	return timestamp < Date.now();
}
