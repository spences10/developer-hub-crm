import type { Contact } from '$lib/server/db/schema';
import { getContext, hasContext, setContext } from 'svelte';

// Create a unique symbol for our context
const CONTACT_CONTEXT_KEY = Symbol('contact-context');

// Define the interface for our contact state
interface ContactState {
	// State
	contacts: Contact[];
	loading: boolean;
	error: string | null;

	// Computed values
	total_contacts: number;
	vip_contacts: number;

	// Methods
	initialize: (contacts: Contact[]) => void;
	update_contact: (updated_contact: Contact) => void;
	add_contact: (new_contact: Contact) => void;
	delete_contact: (contact_id: string) => void;
	get_filtered_contacts: (search_term?: string) => Contact[];
}

/**
 * Creates and returns contact state context
 * Following the recommended pattern from Svelte core team for state management with runes
 */
export function create_contact_state(
	initial_contacts: Contact[] = [],
): ContactState {
	// Check if context already exists to prevent duplicates
	if (hasContext(CONTACT_CONTEXT_KEY)) {
		return getContext<ContactState>(CONTACT_CONTEXT_KEY);
	}

	// Create reactive state variables using $state rune
	let contacts = $state<Contact[]>(initial_contacts);
	let loading = $state<boolean>(false);
	let error = $state<string | null>(null);

	// Computed values using $derived rune
	const total_contacts = $derived(contacts.length);
	const vip_contacts = $derived(
		contacts.filter((contact) => contact.vip).length,
	);

	// Methods for manipulating state
	function initialize(new_contacts: Contact[]): void {
		contacts = [...new_contacts];
	}

	function update_contact(updated_contact: Contact): void {
		contacts = contacts.map((contact) =>
			contact.id === updated_contact.id
				? { ...updated_contact }
				: contact,
		);
	}

	function add_contact(new_contact: Contact): void {
		contacts = [...contacts, { ...new_contact }];
	}

	function delete_contact(contact_id: string): void {
		contacts = contacts.filter(
			(contact) => contact.id !== contact_id,
		);
	}

	function get_filtered_contacts(
		search_term: string = '',
	): Contact[] {
		return contacts.filter((contact) => {
			if (!search_term) return true;
			const search_lower = search_term.toLowerCase();
			return (
				contact.name.toLowerCase().includes(search_lower) ||
				(contact.industry?.toLowerCase().includes(search_lower) ??
					false) ||
				(contact.location?.toLowerCase().includes(search_lower) ??
					false) ||
				(contact.relationship?.toLowerCase().includes(search_lower) ??
					false)
			);
		});
	}

	const contact_state = {
		// State
		contacts,
		loading,
		error,

		// Computed values
		total_contacts,
		vip_contacts,

		// Methods
		initialize,
		update_contact,
		add_contact,
		delete_contact,
		get_filtered_contacts,
	};

	// Set the context and return it
	return setContext<ContactState>(CONTACT_CONTEXT_KEY, contact_state);
}

/**
 * Gets the existing contact state context
 */
export function get_contact_state(): ContactState {
	if (!hasContext(CONTACT_CONTEXT_KEY)) {
		throw new Error(
			'Contact state context not found. Make sure to call create_contact_state first.',
		);
	}
	return getContext<ContactState>(CONTACT_CONTEXT_KEY);
}
