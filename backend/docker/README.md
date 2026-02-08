# Backend Docker Configuration

**Note:** This directory contains the legacy backend-only Docker setup. For the complete monorepo setup (recommended), use the docker-compose files at the repository root.

## Legacy Backend-Only Setup

To run just the backend with PostgreSQL:

```bash
cd backend/docker
docker compose up
```

## Recommended: Full Monorepo Setup

Use the root-level docker-compose for a complete setup including frontend:

```bash
# From repository root
docker compose up
```

See [../../DEVELOPMENT.md](../../DEVELOPMENT.md) for full instructions.
