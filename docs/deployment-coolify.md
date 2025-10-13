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

**Production (Coolify):**

| Variable        | Required | Example                             |
| --------------- | -------- | ----------------------------------- |
| `ORIGIN`        | ✅       | `https://your-domain.com`           |
| `AUTH_SECRET`   | ✅       | Generate: `openssl rand -base64 32` |
| `AUTH_BASE_URL` | Optional | `https://your-domain.com`           |
| `INGEST_TOKEN`  | ✅       | For backup tasks (any secure token) |
| `DATABASE_PATH` | ✅       | `/app/data/local.db`                |
| `NODE_ENV`      | Optional | `production`                        |

**Local Development (optional, for pull_database):**

| Variable         | Required | Example                   |
| ---------------- | -------- | ------------------------- |
| `PRODUCTION_URL` | Optional | `https://your-domain.com` |
| `INGEST_TOKEN`   | Optional | Same as production        |

## Coolify Setup

**Build:** `pnpm install && pnpm run build`

**Start:** `node ./build/index.js`

### Persistent Storage

⚠️ **CRITICAL**: Set this up before production use or you'll lose data
on every deployment!

In Coolify → Your Application → **Storage**:

**Data directory (database + backups):**

- **Type**: Directory Mount
- **Mount Path**: `/app/data`

**Environment Variable:** Add `DATABASE_PATH=/app/data/local.db` to
ensure the app uses the correct path in production.

**What gets stored:**

- Database: `/app/data/local.db` (+ WAL/SHM files)
- Backups: `/app/data/backups/local-YYYY-MM-DD-HH00.db`

**On host (managed by Coolify):**

- Location: `/data/coolify/applications/[app-id]/`
- Database: `local.db`, `local.db-wal`, `local.db-shm`
- Backups: `backups/local-*.db`

**Local Development:** The database will be stored in `data/local.db`
(gitignored) and backups in `data/backups/`.

### Database Backups

The backup system uses SQLite's native backup API to safely create
backups even with WAL mode enabled. See:
[SQLite Corruption with fs.copyFile()](https://scottspence.com/posts/sqlite-corruption-fs-copyfile-issue)

**Manual backup:**

```bash
curl -X POST https://devhub.party/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"task": "backup_database", "token": "your-ingest-token"}'
```

**Response:**

```json
{
	"message": "Database exported successfully",
	"backup_file": "local-2025-10-13-1700.db",
	"backup_size": "1MB",
	"backups_kept": 1,
	"files_deleted": 0
}
```

**Download production backup directly:**

```bash
curl -H "Authorization: Bearer your-ingest-token" \
  https://devhub.party/api/ingest/download \
  -o production-backup.db
```

This downloads the most recent backup file. Useful for manual
inspection or offline analysis.

**Pull production database to local:**

```bash
curl -X POST http://localhost:5173/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"task": "pull_database", "token": "your-ingest-token"}'
```

**Response:**

```json
{
	"message": "Database pulled from production successfully",
	"downloaded_backup": "local-downloaded-2025-10-13-1835.db",
	"database_size": "1MB",
	"local_backup_created": "local-backup-2025-10-13-1835.db"
}
```

This will:

1. Download the latest production backup via `/api/ingest/download`
2. Create a backup of your current local database
3. Replace local database with production data (using SQLite backup
   API)

Perfect for debugging production issues locally! Requires
`PRODUCTION_URL` environment variable in local `.env` file.

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
          curl -X POST https://devhub.party/api/ingest \
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
  -e DATABASE_PATH=/app/data/local.db \
  -v $(pwd)/data:/app/data \
  your-image
```

## Common Issues

| Issue                       | Cause                         | Fix                                   |
| --------------------------- | ----------------------------- | ------------------------------------- |
| 403 on forms                | Missing ORIGIN                | Set ORIGIN environment variable       |
| `__filename not defined`    | better-sqlite3 not external   | Add to ssr.external                   |
| Database lost on restart    | Not in persistent storage     | Mount `/app/data` to volume           |
| Backup size shows 0MB       | Small database (<1MB)         | Normal - it's a rounding artifact     |
| Old data after redeployment | Using wrong DATABASE_PATH     | Set to `/app/data/local.db`           |
| Duplicate database files    | Changed storage configuration | Clean up old files, verify mount path |

## Troubleshooting

### Database appears empty but WAL file is large

If you see:

- `local.db` is small (4KB)
- `local.db-wal` is large (several MB)

This means uncommitted transactions are in the WAL file. The backup
process handles this correctly using SQLite's native backup API, which
automatically checkpoints the WAL.

### Data in wrong location

If you find database files in unexpected locations:

1. Check your `DATABASE_PATH` environment variable in Coolify
2. Check Coolify logs for `[db-path]` output showing resolved path
3. Verify persistent storage mount points in Coolify UI
4. Clean up old database files after confirming correct location:

```bash
# On Coolify host - ONLY after verifying correct setup!
cd /data/coolify/applications/[app-id]/
rm -rf app/  # Old directory from previous configuration
```

### Verifying backup workflow

Test the complete backup and restore workflow:

1. Add a contact in production
2. Trigger backup:
   `curl -X POST .../api/ingest -d '{"task":"backup_database",...}'`
3. Pull to local:
   `curl -X POST localhost:5173/api/ingest -d '{"task":"pull_database",...}'`
4. Verify the new contact appears in your local database

If this works, your backup system is functioning correctly!

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

## Verification Steps

After deployment, verify your setup is working correctly:

### 1. Check application is running

```bash
curl https://your-domain.com/api/health
```

Should return: `{"status":"ok","timestamp":"...","uptime":...}`

### 2. Verify persistent storage

**In container:**

```bash
docker exec [container-name] ls -la /app/data/
```

Should show: `local.db`, `local.db-wal`, `local.db-shm`, `backups/`

**On host:**

```bash
ls -la /data/coolify/applications/[app-id]/
```

Should show the same files (mapped via volume mount).

### 3. Test backup creation

```bash
curl -X POST https://your-domain.com/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"task": "backup_database", "token": "your-ingest-token"}'
```

**Check Coolify logs** for output like:

```
[backup_database] Database path: /app/data/local.db
[backup_database] Backups directory: /app/data/backups
[backup_database] Backup created successfully
```

**Verify backup exists:**

```bash
docker exec [container-name] ls -lh /app/data/backups/
```

Should show backup files: `local-2025-10-13-1700.db`

### 4. Test data persistence

1. Create a contact or make a change in your app
2. Trigger a backup
3. Redeploy the application
4. Verify your data is still there

If data disappears after redeployment, your persistent storage is not
configured correctly!

## Checklist

- [ ] ORIGIN set
- [ ] AUTH_SECRET generated
- [ ] INGEST_TOKEN set
- [ ] DATABASE_PATH set to `/app/data/local.db`
- [ ] better-sqlite3 in dependencies
- [ ] ssr.external configured
- [ ] Directory mount for `/app/data`
- [ ] Health check configured: `/api/health`
- [ ] Build succeeds
- [ ] Login/register work
- [ ] Backup creates files in `/app/data/backups/`
- [ ] Data persists after redeployment
- [ ] Automated backups scheduled
