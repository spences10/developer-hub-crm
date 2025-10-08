import { createAuthClient } from 'better-auth/svelte';
import { dev } from '$app/environment';

export const auth_client = createAuthClient({
	baseURL: dev ? 'http://localhost:5173' : window.location.origin,
});
