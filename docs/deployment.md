# Deployment

Two deployment options:

## [Coolify (Self-Hosted)](./deployment-coolify.md)

VPS deployment with SQLite.

**Stack:** Coolify/VPS, SQLite (better-sqlite3), local filesystem

**Cost:** $5-20/mo (VPS)

**Best for:** MVP, small-medium apps, single region

## [Bunny.net (Edge Platform)](./deployment-bunny.net.md)

Global edge deployment with Magic Containers + Turso.

**Stack:** Magic Containers, Turso (libSQL), Bunny Storage/CDN

**Cost:** $15-110/mo (pay-as-you-go)

**Best for:** Global distribution, edge performance, auto-scaling

## Comparison

| Aspect       | Coolify        | Bunny.net                      |
| ------------ | -------------- | ------------------------------ |
| Cost         | $5-20/mo (VPS) | $15-110/mo (usage-based)       |
| Regions      | Single         | 41+ global edge                |
| Database     | SQLite (local) | Turso (global libSQL)          |
| Scaling      | Vertical       | Horizontal (auto)              |
| Setup        | Simpler        | More complex (Turso migration) |
| Read Latency | Local          | Zero (embedded replica)        |

## Recommendation

Start with **Coolify** for MVP. Migrate to **Bunny.net** when scaling
globally or need edge performance.
