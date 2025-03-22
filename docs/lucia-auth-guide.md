# Lucia Auth Guide

## Overview

Lucia is a simple, flexible authentication library that provides a set
of tools to build secure authentication systems. Our implementation
uses Lucia patterns with a custom approach.

## Current Implementation

Our current implementation uses Lucia patterns with:

- Argon2 for password hashing (via @node-rs/argon2)
- Session-based authentication with cookies
- Token generation and validation

## Key Components

### Session Management

- Sessions are stored in the database
- Session tokens are generated cryptographically
- Sessions expire after 30 days by default
- Sessions are automatically renewed when nearing expiration

### Password Handling

- Passwords are hashed using Argon2 with secure parameters:
  - Memory cost: 19456
  - Time cost: 2
  - Output length: 32
  - Parallelism: 1

### Authentication Flow

1. User registers with username/password
2. Password is hashed and stored
3. On login, password is verified against stored hash
4. Session token is generated and stored in cookies
5. Session token is validated on each request

## Usage Examples

### User Registration

```typescript
// Generate user ID
const userId = generateUserId();

// Hash password
const passwordHash = await hash(password, {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1,
});

// Store user in database
await db
	.insert(table.user)
	.values({ id: userId, username, passwordHash });

// Create session
const sessionToken = auth.generateSessionToken();
const session = await auth.createSession(sessionToken, userId);

// Set session cookie
auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
```

### User Login

```typescript
// Verify password
const validPassword = await verify(
	existingUser.passwordHash,
	password,
	{
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	},
);

// Create session
const sessionToken = auth.generateSessionToken();
const session = await auth.createSession(
	sessionToken,
	existingUser.id,
);

// Set session cookie
auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
```

### Session Validation

```typescript
// In hooks.server.ts
const sessionToken = event.cookies.get(auth.sessionCookieName);
if (sessionToken) {
	const { session, user } =
		await auth.validateSessionToken(sessionToken);
	event.locals.user = user;
	event.locals.session = session;
}
```

## Security Considerations

- Session tokens are hashed before storage
- Passwords are never stored in plain text
- Argon2 parameters are set for high security
- Sessions automatically expire
- CSRF protection via SvelteKit's built-in mechanisms

## Integration with SvelteKit

- Authentication state is available via event.locals
- Auth guards can be implemented in +page.server.ts files
- Session management is handled in hooks.server.ts
