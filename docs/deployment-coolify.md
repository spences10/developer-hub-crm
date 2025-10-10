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
| `INGEST_TOKEN`  | ✅       | For backup tasks (any secure token) |
| `DATABASE_PATH` | Optional | `/app/local.db` (production only)   |
| `NODE_ENV`      | Optional | `production`                        |

## Coolify Setup

**Build:** `pnpm install && pnpm run build`

**Start:** `node ./build/index.js`

### Persistent Storage

⚠️ **CRITICAL**: Set this up before production use or you'll lose data
on every deployment!

In Coolify → Your Application → **Storage**:

1. **Database file:**
   - **Type**: File Mount
   - **Mount Path**: `/app/local.db`

2. **Backups directory:**
   - **Type**: Directory Mount
   - **Mount Path**: `/app/backups`

**Environment Variable:** Add `DATABASE_PATH=/app/local.db` to ensure
the app uses the correct path in production.

**Local Development:** The database will be stored in `data/local.db`
(gitignored) and backups in `data/backups/`.

### Database Backups

Set up automated backups via cron job or GitHub Actions:

**Manual backup:**

```bash
curl -X POST https://devhubcrm.com/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"task": "backup_database", "token": "your-ingest-token"}'
```

**Response:**

```json
{
	"message": "Database exported successfully",
	"backup_file": "local-2025-10-10-1800.db",
	"backup_size": "5MB",
	"backups_kept": 28,
	"files_deleted": 0
}
```

**Automatic backup with GitHub Actions:**

Create `.github/workflows/backup.yml`:

```yaml
name: Database Backup
on:
  schedule:
    - cron: '0 */6 * * *' # Every 6 hours
  workflow_dispatch: # Manual trigger

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger backup
        run: |
          curl -X POST https://devhubcrm.com/api/ingest \
            -H "Content-Type: application/json" \
            -d '{"task": "backup_database", "token": "${{ secrets.INGEST_TOKEN }}"}'
```

**Backup retention:**

- Keeps 28 most recent backups (7 days × 4 backups/day)
- Automatically deletes older backups
- Uses SQLite's native backup API (safe with WAL mode)

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

## Health Check

Coolify health check endpoint: `/api/health`

Returns:

```json
{
	"status": "ok",
	"timestamp": "2025-10-10T18:00:00.000Z",
	"uptime": 3600
}
```

## Checklist

- [ ] ORIGIN set
- [ ] AUTH_SECRET generated
- [ ] INGEST_TOKEN set
- [ ] DATABASE_PATH set to `/app/local.db`
- [ ] better-sqlite3 in dependencies
- [ ] ssr.external configured
- [ ] File mount for `/app/local.db`
- [ ] Directory mount for `/app/backups`
- [ ] Health check configured: `/api/health`
- [ ] Build succeeds
- [ ] Login/register work
- [ ] Automated backups scheduled
