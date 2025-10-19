// Date utility functions for Devhub CRM
import {
	format,
	isPast,
	isToday,
	isTomorrow,
	startOfDay,
} from 'date-fns';

export type DateFormat = 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY';
export type TimeFormat = '12h' | '24h';

/**
 * Map our custom date format strings to date-fns format strings
 */
function get_date_fns_format(format: DateFormat): string {
	switch (format) {
		case 'YYYY-MM-DD':
			return 'yyyy-MM-dd';
		case 'MM/DD/YYYY':
			return 'MM/dd/yyyy';
		case 'DD/MM/YYYY':
			return 'dd/MM/yyyy';
		default:
			return 'yyyy-MM-dd';
	}
}

/**
 * Format a date according to the specified format
 * @param date - Date object
 * @param date_format - Date format ('YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY')
 */
export function format_date(
	date: Date,
	date_format: DateFormat,
): string {
	return format(date, get_date_fns_format(date_format));
}

/**
 * Format a timestamp as a human-readable due date
 * Returns "Today", "Tomorrow", "Overdue: [formatted date]", or formatted date
 * @param timestamp - Unix timestamp in milliseconds
 * @param date_format - Date format (default: 'YYYY-MM-DD')
 */
export function format_due_date(
	timestamp: number,
	date_format: DateFormat = 'YYYY-MM-DD',
): string {
	const date = new Date(timestamp);
	const date_only = startOfDay(date);

	if (isToday(date_only)) {
		return 'Today';
	} else if (isTomorrow(date_only)) {
		return 'Tomorrow';
	} else if (isPast(date_only)) {
		return `Overdue: ${format_date(date, date_format)}`;
	} else {
		return format_date(date, date_format);
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
 * @param time_format - Time format ('12h' or '24h')
 */
export function format_time(
	date: Date,
	time_format: TimeFormat = '24h',
): string {
	return format(date, time_format === '12h' ? 'h:mm a' : 'HH:mm');
}

/**
 * Format date and time together
 * @param date - Date object
 * @param date_format - Date format
 * @param time_format - Time format
 */
export function format_datetime(
	date: Date,
	date_format: DateFormat = 'YYYY-MM-DD',
	time_format: TimeFormat = '24h',
): string {
	return `${format_date(date, date_format)} ${format_time(date, time_format)}`;
}
