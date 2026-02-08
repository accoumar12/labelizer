# Development

## Prerequisites

- Docker and Docker Compose
- Node.js and npm (optional, for local frontend development without Docker)

## Getting Started

You can run the application in two ways: using Docker Compose (recommended) or running services individually.

### Option 1: Docker Compose (Recommended)

#### Production Mode

Run the entire stack (PostgreSQL, backend, and frontend) with:

```bash
docker compose up
```

The application will be available at `http://localhost`.
The backend API will be available at `http://localhost:42042`.

#### Development Mode with Hot Reloading

For development with automatic code reloading:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --watch
```

This enables:
- Backend hot reload on code changes
- Frontend hot reload with Vite dev server at `http://localhost:5173`
- PostgreSQL database

**Environment Variables:**

Copy `.env.example` to `.env` and adjust as needed:
```bash
cp .env.example .env
```

**NOTE:** If you see a `psycopg2.errors.UniqueViolation` or `psycopg2.OperationalError` error, restart the services:

```bash
docker compose down
docker compose up
```

### Option 2: Individual Services

#### 1. Launch the Backend (Legacy Method)

From the repository root:

```bash
cd backend/docker
docker compose up
```

The backend API will be available at `http://localhost:42042`.

#### 2. Launch the Frontend Locally

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### Upload Sample Data and Play

1. Go to `http://localhost:5173/db` (or `http://localhost/db` if using full Docker Compose)
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
