import { getContext, hasContext, setContext } from 'svelte'
import type { Contact } from '$lib/server/db/schema'

// Create a unique symbol for our context
const CONTACT_CONTEXT_KEY = Symbol('contact-context')

// Define the interface for our contact store
interface ContactStore {
	// State
	contacts: Contact[]
	loading: boolean
	error: string | null
	
	// Computed values
	total_contacts: number
	vip_contacts: number
	
	// Methods
	initialize: (contacts: Contact[]) => void
	get_filtered_contacts: (search_term?: string) => Contact[]
}

/**
 * Creates and returns a contact store context
 * Following the recommended pattern from Svelte core team
 */
export function create_contact_store(initial_contacts: Contact[] = []): ContactStore {
	// Check if context already exists to prevent duplicates
	if (hasContext(CONTACT_CONTEXT_KEY)) {
		return getContext<ContactStore>(CONTACT_CONTEXT_KEY)
	}

	// Create reactive state variables
	let contacts = $state<Contact[]>(initial_contacts)
	let loading = $state<boolean>(false)
	let error = $state<string | null>(null)

	// Computed values
	const total_contacts = $derived(contacts.length)
	const vip_contacts = $derived(contacts.filter(contact => contact.vip).length)

	// Methods for manipulating state
	function initialize(new_contacts: Contact[]): void {
		contacts = new_contacts
	}

	function get_filtered_contacts(search_term: string = ''): Contact[] {
		if (!search_term) return contacts
		
		return contacts.filter(contact => 
			contact.name.toLowerCase().includes(search_term.toLowerCase()) ||
			(contact.location && contact.location.toLowerCase().includes(search_term.toLowerCase())) ||
			(contact.industry && contact.industry.toLowerCase().includes(search_term.toLowerCase()))
		)
	}

	// Create the context value
	const contact_store: ContactStore = {
		// State
		get contacts() { return contacts },
		get loading() { return loading },
		get error() { return error },
		
		// Computed values
		get total_contacts() { return total_contacts },
		get vip_contacts() { return vip_contacts },
		
		// Methods
		initialize,
		get_filtered_contacts
	}

	// Set the context and return it
	return setContext<ContactStore>(CONTACT_CONTEXT_KEY, contact_store)
}

/**
 * Gets the existing contact store context
 */
export function get_contact_store(): ContactStore {
	if (!hasContext(CONTACT_CONTEXT_KEY)) {
		throw new Error('Contact store context not found. Make sure to call create_contact_store first.')
	}
	return getContext<ContactStore>(CONTACT_CONTEXT_KEY)
}
