/**
 * Get computed CSS color value from DaisyUI variable
 */
function get_css_color(variable: string, fallback: string): string {
	if (typeof document === 'undefined') return fallback;

	const computed = getComputedStyle(document.documentElement)
		.getPropertyValue(variable)
		.trim();

	return computed || fallback;
}

/**
 * Generate logo SVG with colors from DaisyUI theme
 */
export function generate_logo_svg(): string {
	const d_color = get_css_color('--color-base-content', '#000000');
	const pill_color = get_css_color('--color-primary', '#ff6b35');
	const h_color = get_css_color('--color-primary-content', '#ffffff');

	return `<svg width="44" height="30" viewBox="8 14 44 30" xmlns="http://www.w3.org/2000/svg">
  <text x="10" y="38" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="900" font-size="24" fill="${d_color}" letter-spacing="-1">D</text>
  <rect x="30" y="20" width="20" height="20" rx="5" ry="5" fill="${pill_color}"/>
  <text x="32" y="38" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="900" font-size="24" fill="${h_color}" letter-spacing="-1">h</text>
</svg>`;
}

/**
 * Generate QR code and return as data URL (client-side only)
 */
export async function generate_qr_code_data_url(
	url: string,
): Promise<string> {
	const logo_svg = generate_logo_svg();
	const logo_data_url = `data:image/svg+xml;base64,${btoa(logo_svg)}`;
	const QRCodeStyling = (await import('qr-code-styling')).default;

	const qr_code = new QRCodeStyling({
		width: 300,
		height: 300,
		type: 'svg',
		data: url,
		margin: 10,
		image: logo_data_url,
		qrOptions: {
			typeNumber: 0,
			errorCorrectionLevel: 'H',
		},
		imageOptions: {
			hideBackgroundDots: true,
			imageSize: 0.4,
			margin: 5,
			crossOrigin: 'anonymous',
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
