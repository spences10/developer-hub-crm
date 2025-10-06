# Bunny.net Deployment

Global edge platform with Magic Containers + Turso.

## Stack

- Database: Turso (libSQL with embedded replicas)
- Storage: Bunny Storage + CDN
- Hosting: Magic Containers (41+ regions)

## Architecture

```
Magic Containers → SvelteKit
  ├─ Turso Embedded Replica (local SQLite)
  └─ Syncs → Turso Cloud (global replication)

Bunny Storage/CDN → Assets
```

## Turso Setup

**Create database:**

```bash
turso db create devhub-crm
turso db show devhub-crm --url
turso db tokens create devhub-crm
```

**Update code:**

```bash
pnpm remove better-sqlite3
pnpm add @libsql/client
```

**src/lib/server/db.ts:**

```typescript
import { createClient } from '@libsql/client';

const db = createClient({
	url: process.env.TURSO_DATABASE_URL,
	authToken: process.env.TURSO_AUTH_TOKEN,
	syncUrl: process.env.TURSO_DATABASE_URL, // Embedded replica
});

export { db };
```

## Environment Variables

| Variable             | Required | Source                  |
| -------------------- | -------- | ----------------------- |
| `TURSO_DATABASE_URL` | ✅       | turso db show           |
| `TURSO_AUTH_TOKEN`   | ✅       | turso db tokens         |
| `ORIGIN`             | ✅       | Your domain             |
| `AUTH_SECRET`        | ✅       | openssl rand -base64 32 |
| `BUNNY_API_KEY`      | Optional | Bunny.net dashboard     |
| `BUNNY_STORAGE_ZONE` | Optional | Storage zone name       |
| `BUNNY_CDN_URL`      | Optional | Pull zone URL           |

## Docker Setup

**Dockerfile:**

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "build"]
```

**Build for linux/amd64:**

```bash
docker buildx build --platform linux/amd64 -t registry/devhub-crm:latest .
docker push registry/devhub-crm:latest
```

## Magic Containers Deployment

**1. Setup Registry**

- Magic Containers → Image Registries
- Add GitHub/Docker registry
- Provide read:packages token

**2. Create App**

- Click "Add App"
- Deployment: Magic (AI global)
- Select registry, image, tag

**3. Configure**

- Container Port: 3000
- Add environment variables

**4. Setup Endpoint**

- Exposure: CDN or Anycast ($2/mo)
- Container Port: 3000
- Domain: your-domain.com

## Bunny Storage (Optional)

**Create Storage Zone:**

- Dashboard → Storage → Add Zone
- Name: devhub-assets
- Regions: 2+

**Create Pull Zone (CDN):**

- Dashboard → CDN → Add Pull Zone
- Origin: Storage zone
- Domain: assets.your-domain.com

## Embedded Replicas Benefits

- Reads: Zero latency (local SQLite file)
- Writes: Sync to cloud, replicate globally
- Network resilience
- Auto-scaling across 41+ regions

## Cost (at scale)

- Magic Containers: $10-50/mo
- Turso: Free tier or $29/mo
- Bunny Storage/CDN: $5-10/mo
- **Total: $15-110/mo**

## Checklist

- [ ] Turso database created
- [ ] TURSO_DATABASE_URL and TURSO_AUTH_TOKEN set
- [ ] Code migrated to @libsql/client
- [ ] Docker image built for linux/amd64
- [ ] Magic Containers app deployed
- [ ] Endpoints configured
- [ ] ORIGIN set
- [ ] Login/register work globally
