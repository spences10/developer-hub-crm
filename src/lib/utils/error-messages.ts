/**
 * Standard HTTP error messages and descriptions
 */
export const error_messages: Record<number, string> = {
	400: 'Bad Request',
	401: 'Unauthorized',
	403: 'Forbidden',
	404: 'Page Not Found',
	500: 'Internal Server Error',
	503: 'Service Unavailable',
};

export const error_descriptions: Record<number, string> = {
	400: 'The request could not be understood by the server.',
	401: 'You need to be logged in to access this page.',
	403: "You don't have permission to access this resource.",
	404: "The page you're looking for doesn't exist.",
	500: 'Something went wrong on our end. Please try again later.',
	503: 'The service is temporarily unavailable. Please try again later.',
};

/**
 * Get error title with fallback
 */
export function get_error_title(
	status: number,
	message?: string,
	custom_messages?: Record<number, string>,
): string {
	if (custom_messages?.[status]) {
		return custom_messages[status];
	}
	return message || error_messages[status] || 'Unknown Error';
}

/**
 * Get error description with fallback
 */
export function get_error_description(
	status: number,
	custom_descriptions?: Record<number, string>,
): string {
	if (custom_descriptions?.[status]) {
		return custom_descriptions[status];
	}
	return (
		error_descriptions[status] ||
		'An unexpected error occurred. Please try again.'
	);
}
