# Coolify Deployment

Self-hosted VPS deployment with SQLite.

## Stack

- Database: SQLite (better-sqlite3)
- Storage: Local filesystem
- Hosting: Coolify/VPS

## Configuration

**package.json:**

- `better-sqlite3` in `dependencies` (not devDependencies)

**vite.config.ts:**

```typescript
export default defineConfig({
	ssr: { external: ['better-sqlite3'] },
});
```

## Environment Variables

| Variable        | Required | Example                             |
| --------------- | -------- | ----------------------------------- |
| `ORIGIN`        | ✅       | `https://your-domain.com`           |
| `AUTH_SECRET`   | ✅       | Generate: `openssl rand -base64 32` |
| `AUTH_BASE_URL` | Optional | `https://your-domain.com`           |
| `NODE_ENV`      | Optional | `production`                        |

## Coolify Setup

**Build:** `pnpm install && pnpm run build`

**Start:** `node ./build/index.js`

**Persistent Volume:** Mount to `/app/local.db`

## Docker (Alternative)

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build
EXPOSE 3000
CMD ["node", "./build/index.js"]
```

```bash
docker run -p 3000:3000 \
  -e ORIGIN=https://your-domain.com \
  -e AUTH_SECRET=your-secret \
  -v $(pwd)/local.db:/app/local.db \
  your-image
```

## Common Issues

| Issue                    | Cause                       | Fix                             |
| ------------------------ | --------------------------- | ------------------------------- |
| 403 on forms             | Missing ORIGIN              | Set ORIGIN environment variable |
| `__filename not defined` | better-sqlite3 not external | Add to ssr.external             |
| Database lost on restart | Not in persistent storage   | Mount local.db to volume        |

## Checklist

- [ ] ORIGIN set
- [ ] AUTH_SECRET generated
- [ ] better-sqlite3 in dependencies
- [ ] ssr.external configured
- [ ] local.db in persistent storage
- [ ] Build succeeds
- [ ] Login/register work
