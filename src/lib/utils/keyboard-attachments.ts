/**
 * Reusable keyboard event attachments for Svelte 5 {@attach} directive
 *
 * These attachments provide common keyboard interaction patterns that can be
 * attached to DOM elements using the {@attach} directive.
 *
 * @example
 * ```svelte
 * <textarea {@attach ctrl_enter_submit()}></textarea>
 * <textarea {@attach ctrl_enter_callback(() => save_data())}></textarea>
 * ```
 */

type AttachmentFn = (element: HTMLElement) => (() => void) | void;

/**
 * Attachment that submits the parent form when Ctrl+Enter (or Cmd+Enter on Mac) is pressed
 *
 * @returns Attachment function for use with {@attach}
 *
 * @example
 * ```svelte
 * <textarea name="note" {@attach ctrl_enter_submit()}></textarea>
 * ```
 */
export function ctrl_enter_submit(): AttachmentFn {
	return (element: HTMLElement) => {
		const handler = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
				e.preventDefault();
				const form = (e.target as HTMLElement).closest('form');
				form?.requestSubmit();
			}
		};

		element.addEventListener('keydown', handler);
		return () => element.removeEventListener('keydown', handler);
	};
}

/**
 * Attachment that executes a custom callback when Ctrl+Enter (or Cmd+Enter on Mac) is pressed
 * For input/textarea elements, passes the current value to the callback
 *
 * @param callback - Function to execute on Ctrl+Enter, receives the input value for input/textarea elements
 * @returns Attachment function for use with {@attach}
 *
 * @example
 * ```svelte
 * <textarea {@attach ctrl_enter_callback((value) => save_field('notes', value, contact))}></textarea>
 * <div {@attach ctrl_enter_callback(() => perform_action())}></div>
 * ```
 */
export function ctrl_enter_callback(
	callback: (value?: string) => void,
): AttachmentFn {
	return (element: HTMLElement) => {
		const handler = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
				e.preventDefault();
				const target = e.target as
					| HTMLInputElement
					| HTMLTextAreaElement;
				// Pass value for input/textarea elements, undefined otherwise
				const value =
					'value' in target && typeof target.value === 'string'
						? target.value
						: undefined;
				callback(value);
			}
		};

		element.addEventListener('keydown', handler);
		return () => element.removeEventListener('keydown', handler);
	};
}

/**
 * Attachment that executes a callback when Escape key is pressed
 * Useful for cancel actions, closing modals, etc.
 *
 * @param callback - Function to execute on Escape
 * @returns Attachment function for use with {@attach}
 *
 * @example
 * ```svelte
 * <input {@attach escape_key(() => cancel_edit())} />
 * ```
 */
export function escape_key(callback: () => void): AttachmentFn {
	return (element: HTMLElement) => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				callback();
			}
		};

		element.addEventListener('keydown', handler);
		return () => element.removeEventListener('keydown', handler);
	};
}
