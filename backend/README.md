# Codexa Website — Backend API

Backend API for the official Codexa website, built with NestJS, TypeScript, Prisma, and PostgreSQL.

## Technology Stack

* Node.js 24
* NestJS 11
* TypeScript
* PostgreSQL 16
* Prisma ORM 7
* Jest
* Docker
* Docker Compose

## Requirements

For the recommended Docker setup, you only need:

* Git
* Docker
* Docker Compose

Node.js, npm, and PostgreSQL do not need to be installed locally.

## Quick Start with Docker

Clone the repository:

```bash
git clone git@github.com:Codexa-net/Codexa-Website.git
cd Codexa-Website/backend
```

Build and start the backend and database:

```bash
docker compose up --build -d
```

Check the running services:

```bash
docker compose ps
```

The default services will be available at:

* Backend API: http://localhost:3001
* PostgreSQL: localhost:5432

Test the API:

```bash
curl http://localhost:3001
```

Expected response:

```text
Hello World!
```

## Environment Variables

Docker Compose includes safe development defaults. To customize them, create a local `.env` file:

```bash
cp .env.example .env
```

Available variables:

| Variable            |              Default | Description                                 |
| ------------------- | -------------------: | ------------------------------------------- |
| `APP_PORT`          |               `3001` | Backend port exposed on the host machine    |
| `POSTGRES_PORT`     |               `5432` | PostgreSQL port exposed on the host machine |
| `POSTGRES_USER`     |           `postgres` | PostgreSQL username                         |
| `POSTGRES_PASSWORD` |           `postgres` | PostgreSQL password                         |
| `POSTGRES_DB`       |          `codexa_db` | PostgreSQL database name                    |
| `DATABASE_URL`      | Local PostgreSQL URL | Prisma database connection URL              |

Never commit the `.env` file or production credentials.

## Docker Services

### Backend

The backend service:

* Runs NestJS using Node.js 24.
* Installs exact dependency versions using `npm ci`.
* Runs in watch mode during development.
* Exposes the API through port `3001`.
* Shares the source code with the host for live development.

### PostgreSQL

The database service:

* Runs PostgreSQL 16.
* Uses a health check before the backend starts.
* Stores database data in a persistent Docker volume.
* Remains available after stopping and restarting the containers.

Inside Docker, the backend connects to the database using the service hostname:

```text
postgres
```

Do not use `localhost` for communication between Docker containers.

## Common Docker Commands

Start the project:

```bash
docker compose up -d
```

Rebuild and start after dependency or Dockerfile changes:

```bash
docker compose up --build -d
```

View backend logs:

```bash
docker compose logs -f backend
```

View PostgreSQL logs:

```bash
docker compose logs -f postgres
```

Check service status:

```bash
docker compose ps
```

Open a shell inside the backend container:

```bash
docker compose exec backend bash
```

Stop the project:

```bash
docker compose down
```

The database data remains saved after running `docker compose down`.

To delete containers and database volumes:

```bash
docker compose down -v
```

> Warning: The `-v` option permanently deletes the local PostgreSQL data.

## Development Commands

Run a NestJS build check:

```bash
docker compose exec backend npm run build
```

Run unit tests:

```bash
docker compose exec backend npm test
```

Run tests once without watch mode:

```bash
docker compose exec backend npm test -- --runInBand
```

Run end-to-end tests:

```bash
docker compose exec backend npm run test:e2e
```

Format the source code:

```bash
docker compose exec backend npm run format
```

## Prisma Commands

Generate Prisma Client:

```bash
docker compose exec backend npx prisma generate
```

Create a development migration:

```bash
docker compose exec backend npx prisma migrate dev --name migration_name
```

Apply existing migrations:

```bash
docker compose exec backend npx prisma migrate deploy
```

Open Prisma Studio:

```bash
docker compose exec backend npx prisma studio
```

Prisma Studio must be configured with an exposed port before it can be accessed from the host machine.

> Coordinate changes to `prisma/schema.prisma` with the backend technical lead because it is shared by all backend modules.

## Project Structure

```text
backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
├── .dockerignore
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

The project structure will expand as application modules are implemented.

## Git Workflow

The `main` branch contains the stable version of the project, while `develop` is used to integrate completed team tasks before release.

Each team member must create a separate branch for the specific task assigned to them.

Branch names should:

* Describe the assigned task clearly.
* Use English lowercase letters.
* Use hyphens instead of spaces.
* Contain only the code related to that task.

Start every task branch from the latest version of `develop`:

```bash
git switch develop
git pull origin develop
git switch -c task-name
```

Replace `task-name` with the actual assigned task name.

After completing the task:

```bash
git add .
git commit -m "Complete task description"
git push -u origin task-name
```

Then open a Pull Request from the task branch into `develop`.

Each Pull Request must be reviewed and tested before it is merged. After a successful merge, the completed task branch can be deleted.

Team members must not:

* Push task code directly to `main` or `develop`.
* Work on unrelated tasks inside the same branch.
* Add another team member’s work to their branch without coordination.
* Merge their own Pull Request without review.


```bash
git switch develop
git pull origin develop
git switch -c feature/contact-module
```

After completing a task:

```bash
git add .
git commit -m "feat(contact): implement contact module"
git push -u origin feature/contact-module
```

Open a Pull Request from the feature branch into `develop`.

Do not push feature work directly to `main` or `develop`.

## Planned Backend Modules

* Authentication and authorization
* Admin users and roles
* Portfolio projects
* Categories and technologies
* Contact messages
* Dashboard statistics
* File uploads
* API documentation
* Automated tests

## Troubleshooting

### Port 3001 is already in use

Create or edit `.env`:

```env
APP_PORT=3002
```

Then recreate the service:

```bash
docker compose up -d
```

### Port 5432 is already in use

Change the PostgreSQL host port:

```env
POSTGRES_PORT=5433
```

The internal Docker database port remains `5432`.

### View startup errors

```bash
docker compose logs backend --tail=200
docker compose logs postgres --tail=200
```

## Repository

[Codexa Website on GitHub](https://github.com/Codexa-net/Codexa-Website)

## License

This repository is private and intended for authorized Codexa team members.
