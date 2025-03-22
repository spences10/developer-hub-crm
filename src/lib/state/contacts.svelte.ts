import type { Contact } from '$lib/server/db/schema';
import { getContext, hasContext, setContext } from 'svelte';

// Create a unique symbol for our context
const CONTACT_CONTEXT_KEY = Symbol('contact-context');

// Define the interface for our contact state
interface ContactState {
	// State
	readonly contacts: Contact[];
	readonly loading: boolean;
	readonly error: string | null;

	// Computed values
	readonly total_contacts: number;
	readonly vip_contacts: number;

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
	let total_contacts = $derived(contacts.length);
	let vip_contacts = $derived(
		contacts.filter((contact: Contact) => contact.vip).length,
	);

	// Methods for manipulating state
	function initialize(new_contacts: Contact[]): void {
		contacts = [...new_contacts];
	}

	function update_contact(updated_contact: Contact): void {
		loading = true;
		error = null;

		// Optimistically update the contacts array
		const contact_index = contacts.findIndex(
			(c) => c.id === updated_contact.id,
		);
		if (contact_index !== -1) {
			const updated_contacts = [...contacts];
			updated_contacts[contact_index] = updated_contact;
			contacts = updated_contacts;
		}
	}

	function add_contact(new_contact: Contact): void {
		loading = true;
		error = null;

		// Optimistically add the new contact
		contacts = [new_contact, ...contacts];
	}

	function delete_contact(contact_id: string): void {
		loading = true;
		error = null;

		// Optimistically remove the contact
		contacts = contacts.filter((c) => c.id !== contact_id);
	}

	function get_filtered_contacts(search_term?: string): Contact[] {
		if (!search_term) return contacts;
		return contacts.filter((contact) =>
			contact.name.toLowerCase().includes(search_term.toLowerCase()),
		);
	}

	const state: ContactState = {
		// State
		get contacts() {
			return contacts;
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		},

		// Computed values
		get total_contacts() {
			return total_contacts;
		},
		get vip_contacts() {
			return vip_contacts;
		},

		// Methods
		initialize,
		update_contact,
		add_contact,
		delete_contact,
		get_filtered_contacts,
	};

	// Set the context so it can be reused
	setContext(CONTACT_CONTEXT_KEY, state);

	return state;
}

/**
 * Gets the existing contact state context
 */
export function get_contact_state(): ContactState {
	if (!hasContext(CONTACT_CONTEXT_KEY)) {
		throw new Error('Contact state context has not been initialized');
	}
	return getContext<ContactState>(CONTACT_CONTEXT_KEY);
}
