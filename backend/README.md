# Corporación Azul Platform — Backend

Laravel backend for Corporación Azul Platform.

## Local Development Environment (Docker / Laravel Sail)

This project uses Laravel Sail to run the backend with PHP, MySQL, and Redis inside Docker containers.

### Requirements

- Docker Desktop with the Linux engine running
- Docker Compose
- Git

### Initial Setup

From the `backend` directory, copy the example environment configuration:

```bash
cp .env.example .env
```

On Windows CMD, use `copy .env.example .env` instead.

Update `.env` with your local development credentials before starting the containers for the first time.

The development services use the following ports:

| Service | Host port | Container port |
|---|---|---|
| Laravel | 8080 | 80 |
| MySQL | 3307 | 3306 |
| Redis | 63790 | 6379 |

### Start the Environment

From the repository root, run:

```bash
docker compose --project-directory backend -f backend/compose.yaml up -d --build
```

### Generate the Application Key

For a new installation:

```bash
docker compose --project-directory backend -f backend/compose.yaml exec laravel.test php artisan key:generate
```

### Run Database Migrations

```bash
docker compose --project-directory backend -f backend/compose.yaml exec laravel.test php artisan migrate
```

On the first initialization, the MySQL container creates the database and database user using the values from `.env`.

**Important:** Once the MySQL volume has been initialized, changing database names or credentials in `.env` does not automatically update the existing MySQL database or user permissions.

### Access the Application

Open:

http://localhost:8080

### Run Tests

```bash
docker compose --project-directory backend -f backend/compose.yaml exec laravel.test php artisan test
```

Tests are configured to use the separate `testing` MySQL database. Never run destructive test or migration commands against a database containing important data.

### Stop the Environment

```bash
docker compose --project-directory backend -f backend/compose.yaml down
```

This stops and removes the development containers while preserving the MySQL and Redis named volumes.

Avoid using `down -v` unless you explicitly intend to delete the development volumes and their stored data.

### Environment Files

- `.env.example` — Version-controlled configuration template.
- `.env` — Local configuration containing environment-specific credentials; excluded from Git.

Never commit real credentials, application keys, or other secrets.

---
