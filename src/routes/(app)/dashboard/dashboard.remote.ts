import { guarded_query } from '$lib/server/auth-helpers';

export const get_dashboard_data = guarded_query(() => {
	// This function is protected - only authenticated users can access
	return {
		message: 'Welcome to your protected dashboard!',
		timestamp: Date.now(),
	};
});
