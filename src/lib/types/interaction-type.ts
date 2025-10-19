/**
 * Database record for interaction types
 */
export interface InteractionType {
	id: string;
	user_id: string | null; // NULL for system types
	value: string; // e.g., 'meeting', 'call', 'email'
	label: string; // e.g., 'Meeting', 'Call', 'Email'
	icon: string; // Icon component name from $lib/icons
	color: string; // DaisyUI color classes
	display_order: number;
	created_at: number;
	updated_at: number;
}
