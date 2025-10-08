/**
 * Generate QR code and return as data URL (client-side only)
 */
export async function generate_qr_code_data_url(
	url: string,
): Promise<string> {
	const QRCodeStyling = (await import('qr-code-styling')).default;

	const qr_code = new QRCodeStyling({
		width: 300,
		height: 300,
		type: 'svg',
		data: url,
		margin: 10,
		qrOptions: {
			typeNumber: 0,
			errorCorrectionLevel: 'M',
		},
		dotsOptions: {
			color: '#000000',
			type: 'rounded',
		},
		cornersSquareOptions: {
			type: 'rounded',
			color: '#000000',
		},
		cornersDotOptions: {
			type: 'rounded',
			color: '#000000',
		},
		backgroundOptions: {
			color: '#ffffff',
		},
	});

	// Get the raw SVG data
	const svg_data = await qr_code.getRawData('svg');

	if (!svg_data) {
		throw new Error('Failed to generate QR code');
	}

	// Convert Blob to string
	let svg_string: string;
	if (svg_data instanceof Blob) {
		svg_string = await svg_data.text();
	} else {
		svg_string = svg_data as unknown as string;
	}

	// Convert to data URL
	return `data:image/svg+xml;base64,${btoa(svg_string)}`;
}
