# DaisyUI v5 Guide

## Overview

DaisyUI v5 is a major update with improved compatibility with Tailwind
CSS v4, new features, and optimizations. It provides a collection of
pre-designed components and themes for Tailwind CSS.

## Key Features

### Tailwind CSS v4 Compatibility

- Fully compatible with Tailwind CSS v4
- Takes advantage of all new Tailwind CSS v4 features
- Can be imported as a plugin in the CSS file

### Performance Improvements

- Zero dependencies
- Smaller package size
- Smaller CSS output size

### Usage with Tailwind CSS v4

```css
@import 'tailwindcss';
@plugin "daisyui";
```

### Theme Configuration

```css
@import 'tailwindcss';
@plugin "daisyui" {
	themes:
		light --default,
		dark --prefersdark;
}
```

## Themes

DaisyUI comes with multiple built-in themes that can be easily
configured:

- `light` - Light theme
- `dark` - Dark theme
- `cupcake` - Light pastel theme
- `bumblebee` - Light yellow theme
- `emerald` - Light green theme
- `corporate` - Light business theme
- `synthwave` - Dark colorful theme
- `retro` - Light retro theme
- `cyberpunk` - Light cyberpunk theme
- `valentine` - Light pink theme
- `halloween` - Dark purple theme
- `garden` - Light green theme
- `forest` - Dark green theme
- `aqua` - Light blue theme
- `lofi` - Light gray theme
- `pastel` - Light pastel theme
- `fantasy` - Light fantasy theme
- `wireframe` - Light minimal theme
- `black` - Dark black theme
- `luxury` - Dark luxury theme
- `dracula` - Dark purple theme
- `cmyk` - Light CMYK theme
- `autumn` - Light orange theme
- `business` - Dark business theme
- `acid` - Light acid theme
- `lemonade` - Light yellow theme
- `night` - Dark theme
- `coffee` - Dark brown theme
- `winter` - Light winter theme
- `dim` - Dark dim theme
- `nord` - Light nord theme
- `sunset` - Light orange theme

## Components

DaisyUI provides a wide range of pre-designed components including:

- Alert
- Artboard
- Avatar
- Badge
- Breadcrumbs
- Button
- Card
- Carousel
- Chat bubble
- Checkbox
- Collapse
- Countdown
- Divider
- Drawer
- Dropdown
- Footer
- Hero
- Indicator
- Input
- Join
- Kbd
- Link
- Loading
- Menu
- Modal
- Navbar
- Pagination
- Progress
- Radio
- Range
- Rating
- Select
- Skeleton
- Stat
- Steps
- Swap
- Table
- Tabs
- Textarea
- Toast
- Toggle
- Tooltip

## Usage Example

```html
<!-- Button component -->
<button class="btn btn-primary">Button</button>

<!-- Card component -->
<div class="card bg-base-100 w-96 shadow-xl">
	<figure><img src="image.jpg" alt="Card image" /></figure>
	<div class="card-body">
		<h2 class="card-title">Card title</h2>
		<p>Card content goes here</p>
		<div class="card-actions justify-end">
			<button class="btn btn-primary">Action</button>
		</div>
	</div>
</div>
```

## Customization

You can customize DaisyUI themes using CSS variables:

```css
@theme {
	[data-theme='mytheme'] {
		--primary: #570df8;
		--primary-focus: #4506cb;
		--primary-content: #ffffff;
		--secondary: #f000b8;
		--secondary-focus: #bd0091;
		--secondary-content: #ffffff;
		--accent: #37cdbe;
		--accent-focus: #2aa79b;
		--accent-content: #ffffff;
		--neutral: #3d4451;
		--neutral-focus: #2a2e37;
		--neutral-content: #ffffff;
		--base-100: #ffffff;
		--base-200: #f9fafb;
		--base-300: #d1d5db;
		--base-content: #1f2937;
		--info: #2094f3;
		--success: #009485;
		--warning: #ff9900;
		--error: #ff5724;
	}
}
```

## Notable Changes in v5

- Refactored tabs and tab-content from grid to flex
- Fixed unstable margin issue at the end of tab-content
- Improved compatibility with Tailwind CSS v4
- Reduced package size and dependencies
