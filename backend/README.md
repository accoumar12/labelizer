# Backend

This is the backend for the Labelizer app, built with FastAPI and PostgreSQL.

## Development

For general development setup, see the root [DEVELOPMENT.md](../DEVELOPMENT.md).

### Backend-Specific Setup

The backend runs in Docker containers defined in `docker/docker-compose.yml`. Configuration is managed through environment variables (see `docker/.env`).

### Running Tests

```bash
pytest tests/
```

See [tests/README.md](./tests/README.md) for more information about testing.

### Database Migrations

Migrations are managed with Alembic:

```bash
# Create a new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head
```

### API Documentation

When running, interactive API documentation is available at:
- Swagger UI: `http://localhost:42042/docs`
- OpenAPI JSON: `http://localhost:42042/api/labelizer/v1/openapi.json`
