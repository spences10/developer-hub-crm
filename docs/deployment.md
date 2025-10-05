# Deployment Guide

Guide for deploying Dev Hub CRM to production (Coolify or any Node.js
host).

## Prerequisites

- Node.js 18+ installed on server
- Access to production server (SSH or deployment platform)
- Domain name configured (for HTTPS)

## Critical Production Setup

### 1. Native Dependencies

**better-sqlite3 must be in `dependencies`, not `devDependencies`**

```json
// package.json
{
	"dependencies": {
		"better-auth": "^1.3.26",
		"better-sqlite3": "^12.4.1"
	}
}
```

**Why:** Native modules with compiled binaries must be available at
runtime.

### 2. Vite SSR Configuration

**better-sqlite3 must be externalized in Vite config**

```typescript
// vite.config.ts
export default defineConfig({
	ssr: {
		external: ['better-sqlite3'],
	},
});
```

**Why:** Native modules can't be bundled by Vite. This tells Vite to
keep it as an external import so Node.js loads it directly, avoiding
`__filename not defined` errors.

### 3. ORIGIN Environment Variable (Critical!)

**Set ORIGIN to your production domain to avoid CSRF 403 errors**

```bash
# For local production testing
ORIGIN=http://localhost:3000

# For production deployment
ORIGIN=https://your-domain.com
```

**Why:** SvelteKit's form functions have built-in CSRF protection that
checks the Origin header. This is disabled in dev but enforced in
production.

**Common symptoms without ORIGIN:**

- Login works in dev but fails with 403 in production
- Registration returns 403 Forbidden
- Forms fail silently or show "Failed to execute remote function"

### 4. Environment Variables

Create a `.env` file or set these in your deployment platform:

```bash
# Required
ORIGIN=https://your-domain.com
AUTH_SECRET=your-random-secret-key-min-32-chars

# Optional
AUTH_BASE_URL=https://your-domain.com
NODE_ENV=production
```

**Generate AUTH_SECRET:**

```bash
openssl rand -base64 32
```

## Build Commands

### Local Build

```bash
pnpm install
pnpm run build
```

### Production Start

```bash
ORIGIN=https://your-domain.com node ./build/index.js
```

Or update `package.json`:

```json
{
	"scripts": {
		"start": "node ./build/index.js"
	}
}
```

Then set `ORIGIN` in your environment.

## Coolify Deployment

### Build Configuration

**Build Command:**

```bash
pnpm install && pnpm run build
```

**Start Command:**

```bash
node ./build/index.js
```

### Environment Variables

Set in Coolify dashboard:

| Variable        | Value                        | Required |
| --------------- | ---------------------------- | -------- |
| `ORIGIN`        | `https://your-domain.com`    | ✅ Yes   |
| `AUTH_SECRET`   | Generated secret (32+ chars) | ✅ Yes   |
| `AUTH_BASE_URL` | `https://your-domain.com`    | Optional |
| `NODE_ENV`      | `production`                 | Optional |

### Persistent Storage

**SQLite database needs persistent storage!**

In Coolify:

1. Add a persistent volume
2. Mount to `/app/local.db` (or wherever your db file lives)
3. Ensures database survives container restarts

**Database Location:**

- Default: `local.db` in project root
- Location: `/app/local.db` in container (if using default)

## Docker Deployment

Example `Dockerfile`:

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Build application
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "./build/index.js"]
```

**Run with environment variables:**

```bash
docker run -p 3000:3000 \
  -e ORIGIN=https://your-domain.com \
  -e AUTH_SECRET=your-secret \
  -v $(pwd)/local.db:/app/local.db \
  your-image-name
```

## Common Production Issues

### Issue: 403 Forbidden on Login/Register

**Symptom:** Forms work in dev but fail with 403 in production

**Cause:** Missing or incorrect `ORIGIN` environment variable

**Solution:** Set `ORIGIN=https://your-production-domain.com`

### Issue: `__filename is not defined`

**Symptom:** Server crashes on startup with
`ReferenceError: __filename is not defined`

**Cause:**

1. `better-sqlite3` in `devDependencies` instead of `dependencies`
2. Missing `ssr.external` configuration in `vite.config.ts`

**Solution:**

1. Move `better-sqlite3` to `dependencies` in package.json
2. Add `ssr: { external: ['better-sqlite3'] }` to vite.config.ts
3. Rebuild with `pnpm install && pnpm run build`

### Issue: Database Lost on Restart

**Symptom:** Data disappears when container/server restarts

**Cause:** SQLite database not in persistent storage

**Solution:** Mount `local.db` to persistent volume in your deployment
platform

### Issue: Logout Doesn't Work

**Symptom:** Clicking logout does nothing or shows error

**Cause:** Commands cannot use `redirect()` - they must return a
result and use `goto()` client-side

**Solution:** See `docs/auth-pattern.md` for correct logout pattern

## Health Checks

Add a health check endpoint:

```typescript
// src/routes/health/+server.ts
export async function GET() {
	return new Response('OK', { status: 200 });
}
```

Configure in your platform:

- Path: `/health`
- Expected: 200 status code

## Post-Deployment Checklist

- [ ] ORIGIN environment variable set correctly
- [ ] AUTH_SECRET set to random 32+ character string
- [ ] Database file in persistent storage
- [ ] better-sqlite3 in dependencies (not devDependencies)
- [ ] ssr.external configured in vite.config.ts
- [ ] Build completes without errors
- [ ] Server starts without crashes
- [ ] Login/register work
- [ ] Logout redirects correctly
- [ ] Database persists across restarts
- [ ] HTTPS enabled (via Coolify/Caddy/nginx)

## Monitoring

Recommended for production:

1. **Error Tracking:** Sentry, Rollbar, or similar
2. **Uptime Monitoring:** Uptime Robot, Better Uptime
3. **Database Backups:** Regular `.db` file backups
4. **Log Aggregation:** Review application logs regularly

## Scaling Considerations

**SQLite is single-writer:**

- Perfect for small-to-medium apps
- Not suitable for high-concurrency writes
- Consider PostgreSQL if you need multiple servers

**Horizontal Scaling:**

- SQLite requires sticky sessions or shared filesystem
- Better to scale vertically (bigger server) initially
- Migrate to PostgreSQL for true horizontal scaling

## Support

- SvelteKit Docs: https://svelte.dev/docs/kit
- Better Auth Docs: https://better-auth.com
- Remote Functions: https://svelte.dev/docs/kit/remote-functions
