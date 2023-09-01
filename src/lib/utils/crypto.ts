// Generate a new AES-GCM key
export const generate_key = async (): Promise<CryptoKey> => {
	const key = await window.crypto.subtle.generateKey(
		{
			name: 'AES-GCM',
			length: 256, // or 128
		},
		true, // can be exported
		['encrypt', 'decrypt'],
	)
	return key
}

// Encrypt data with AES-GCM
export const encrypt = async (
	plain_text: string | undefined,
	key: CryptoKey,
): Promise<string> => {
	const initialization_vector = window.crypto.getRandomValues(
		new Uint8Array(12),
	)

	const encrypted_data = await window.crypto.subtle.encrypt(
		{
			name: 'AES-GCM',
			iv: initialization_vector,
		},
		key,
		new TextEncoder().encode(plain_text!),
	)

	const encrypted_array = new Uint8Array(encrypted_data)
	const buffer = new ArrayBuffer(
		initialization_vector.length + encrypted_array.length,
	)
	const result = new Uint8Array(buffer)
	result.set(initialization_vector, 0)
	result.set(encrypted_array, initialization_vector.length)

	return window.btoa(
		String.fromCharCode.apply(null, Array.from(result)),
	)
}

// Decrypt data with AES-GCM
export const decrypt = async (
	encrypted_text: string,
	key: CryptoKey,
): Promise<string> => {
	const encrypted_data_bytes = atob(encrypted_text)
	const encrypted_data_array = new Uint8Array(
		encrypted_data_bytes.length,
	).map((_, i) => encrypted_data_bytes.charCodeAt(i))

	const initialization_vector = encrypted_data_array.slice(0, 12)
	const encrypted_data = encrypted_data_array.slice(12)

	const decrypted_data = await window.crypto.subtle.decrypt(
		{
			name: 'AES-GCM',
			iv: initialization_vector,
		},
		key,
		encrypted_data,
	)

	return new TextDecoder().decode(decrypted_data)
}
