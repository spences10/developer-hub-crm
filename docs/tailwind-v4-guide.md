# Tailwind CSS v4 Guide

## Overview

Tailwind CSS v4 is a major update with significant performance
improvements and new features. This version simplifies the
installation process and introduces a CSS-first configuration
approach.

## Key Features

### Performance Improvements

- Full builds up to 5x faster
- Incremental builds over 100x faster (measured in microseconds)
- Optimized for modern browsers

### Simplified Installation

- Fewer dependencies
- Zero configuration required
- Single line of code in CSS file: `@import "tailwindcss";`

### CSS-First Configuration

- Customize and extend directly in CSS instead of JavaScript
  configuration
- Use `@theme` directive to define design tokens
- Use `@plugin` directive to add plugins

### Modern CSS Features

- Built on cascade layers
- Uses registered custom properties with `@property`
- Supports `color-mix()` for color manipulation

### Automatic Content Detection

- Template files discovered automatically
- No configuration required for basic usage

### Built-in Import Support

- No additional tooling needed to bundle multiple CSS files
- Tightly integrated with the Tailwind engine

### First-Party Vite Plugin

- Tight integration for maximum performance
- Minimum configuration required

## Installation

### Basic Usage

```css
@import 'tailwindcss';
```

That's it! No configuration file needed - Tailwind CSS v4 is designed
to work with zero configuration.

### With Plugins

```css
@import 'tailwindcss';
@plugin "@tailwindcss/typography";
```

## Configuration

### Theme Customization

```css
@import 'tailwindcss';

@theme {
	--color-primary: #3b82f6;
	--color-secondary: #10b981;
	--rounded-btn: 0.5rem;
}
```

### Adding Plugins

```css
@import 'tailwindcss';
@plugin "@tailwindcss/typography";
@plugin "daisyui";
```

## New Utilities in v4

- `text-balance` and `text-wrap` utilities
- `text-resize` utilities for auto-resizing textareas
- `color-scheme` utilities for dark mode scrollbars
- `font-stretch` utilities for variable fonts
- `inert` variant for styling non-interactive elements
- `nth-*` variants for advanced targeting
- `in-*` variant (similar to `group-*` but without the `group` class)
- Support for `:popover-open` using the existing `open` variant
- Descendant variant for styling all descendant elements

## Migration from v3

- Stacked variants now apply left to right (like CSS syntax) instead
  of right to left
- Some configuration options like `center` and `padding` no longer
  exist
- See the
  [official upgrade guide](https://tailwindcss.com/docs/upgrade-guide)
  for detailed steps
