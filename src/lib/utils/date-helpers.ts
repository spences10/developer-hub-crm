// Date utility functions for Developer Hub CRM

export type DateFormat = 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY';
export type TimeFormat = '12h' | '24h';

/**
 * Format a date according to the specified format
 * @param date - Date object
 * @param format - Date format ('YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY')
 */
export function format_date(date: Date, format: DateFormat): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	switch (format) {
		case 'YYYY-MM-DD':
			return `${year}-${month}-${day}`;
		case 'MM/DD/YYYY':
			return `${month}/${day}/${year}`;
		case 'DD/MM/YYYY':
			return `${day}/${month}/${year}`;
		default:
			return `${year}-${month}-${day}`;
	}
}

/**
 * Format a timestamp as a human-readable due date
 * Returns "Today", "Tomorrow", "Overdue: [formatted date]", or formatted date
 * @param timestamp - Unix timestamp in milliseconds
 * @param format - Date format (default: 'YYYY-MM-DD')
 */
export function format_due_date(
	timestamp: number,
	format: DateFormat = 'YYYY-MM-DD',
): string {
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
		return `Overdue: ${format_date(date, format)}`;
	} else {
		return format_date(date, format);
	}
}

/**
 * Check if a timestamp is in the past
 * @param timestamp - Unix timestamp in milliseconds
 */
export function is_overdue(timestamp: number): boolean {
	return timestamp < Date.now();
}

/**
 * Format time according to the specified format
 * @param date - Date object
 * @param format - Time format ('12h' or '24h')
 */
export function format_time(
	date: Date,
	format: TimeFormat = '24h',
): string {
	const hours = date.getHours();
	const minutes = String(date.getMinutes()).padStart(2, '0');

	if (format === '12h') {
		const period = hours >= 12 ? 'PM' : 'AM';
		const hours12 = hours % 12 || 12;
		return `${hours12}:${minutes} ${period}`;
	} else {
		const hours24 = String(hours).padStart(2, '0');
		return `${hours24}:${minutes}`;
	}
}

/**
 * Format date and time together
 * @param date - Date object
 * @param dateFormat - Date format
 * @param timeFormat - Time format
 */
export function format_datetime(
	date: Date,
	dateFormat: DateFormat = 'YYYY-MM-DD',
	timeFormat: TimeFormat = '24h',
): string {
	return `${format_date(date, dateFormat)} ${format_time(date, timeFormat)}`;
}
