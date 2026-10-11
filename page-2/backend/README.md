# MW75 TUMI Product API

Node.js 22+ and PostgreSQL product catalog API. Product content and assets are loaded from the API; the backend serves local product images at `/assets/...` so the browser can load them from the frontend origin.

## Local startup

1. Copy `backend/.env.example` to `backend/.env` and adjust `FRONTEND_ORIGIN` if needed.
2. Start PostgreSQL with `docker compose up -d` from this directory. The Compose healthcheck waits for PostgreSQL; the named volume persists data.
3. Run `npm install`, then `npm run migrate` and `npm run seed` from `backend/`.
4. Start the API with `npm run dev`. Health endpoints are `/health` and database readiness is `/ready`.
5. Swagger UI is at `/api-docs`, and the same OpenAPI source is served at `/openapi.json`.

The seed uses local image files from `frontend/assets`, served by the API at `${PUBLIC_API_URL}/assets/...`. Set `PUBLIC_API_URL` to the public API origin in deployed environments. The idempotent seed inserts MW75 only if it is not already present.

## Frontend

Copy `frontend/.env.example` to `frontend/.env`, set `VITE_API_BASE_URL` and `VITE_PRODUCT_ID`, then run `npm install && npm run dev` from `frontend/`. The API origin must match `FRONTEND_ORIGIN` in the backend. Prices are integer minor units (`75000 USD`); frontend formats them as `$750.00`. Stock remains attached to each color variant.

## Database and OpenAPI

`npm run migrate` applies the idempotent SQL schema. `npm run seed` inserts the full two-color MW75 product with eight gallery images, six highlights, three services, collaboration content, all specification rows, and seven box items. Run `npm run validate:openapi` to parse the OpenAPI YAML and check required paths/schemas.

## Environment

`NODE_ENV`, `PORT`, `DATABASE_URL`, `DATABASE_SSL`, `FRONTEND_ORIGIN`, and `PUBLIC_API_URL` configure the API. Do not commit `.env` files or production database credentials.
