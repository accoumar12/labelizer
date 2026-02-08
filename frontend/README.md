# Frontend

This is the frontend for the Labelizer app, built with React and Vite.

## Development

For general development setup, see the root [DEVELOPMENT.md](../DEVELOPMENT.md).

### Frontend-Specific Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev
```

### API Client Generation

The frontend uses an auto-generated TypeScript API client (`src/api.ts`). To regenerate after backend API changes:

```bash
npm run generate
```

This fetches the OpenAPI spec from `http://localhost:42042/api/labelizer/v1/openapi.json`.
