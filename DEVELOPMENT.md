# Development

## Prerequisites

- Docker and Docker Compose (for backend)
- Node.js and npm (for frontend)

## Getting Started

### 1. Launch the Backend

From the repository root:

```bash
cd backend/docker
docker compose up
```

**NOTE:** If you see a `psycopg2.errors.UniqueViolation` or `psycopg2.OperationalError` error, do this (possibly a few times!):

```bash
docker compose down
docker compose up
```

The backend API will be available at `http://localhost:42042`.

### 2. Launch the Frontend

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### 3. Upload Sample Data and Play

1. Go to `http://localhost:5173/db` (directly in URL, not visible in menu)
2. Upload sample data located in `backend/test_data/test_data.zip` in the **Upload Database** section
3. Play with the data in the **Labelling** and **Validation** tabs!

## Project-Specific Documentation

- Backend development: see [backend/README.md](./backend/README.md)
- Frontend development: see [frontend/README.md](./frontend/README.md)

## API Documentation

When the backend is running, you can access the interactive API documentation at:

- Swagger UI: `http://localhost:42042/docs`
- OpenAPI JSON: `http://localhost:42042/api/labelizer/v1/openapi.json`

## Regenerating Frontend API Client

The frontend uses an auto-generated TypeScript API client. To regenerate it after backend changes:

```bash
cd frontend
npm run generate
```

This will fetch the OpenAPI spec from the running backend and generate `frontend/src/api.ts`.
