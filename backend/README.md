Codexa Website — Backend API

Backend API for the official Codexa website, built with NestJS, TypeScript, Prisma, and PostgreSQL.

Technology Stack

Node.js 24

NestJS 11

TypeScript

PostgreSQL 16

Prisma ORM 7

Prisma PostgreSQL Driver Adapter

NestJS Config

Class Validator and Class Transformer

Swagger / OpenAPI

Jest

npm

Docker

Docker Compose

Requirements

For the recommended Docker setup, you only need:

Git

Docker

Docker Compose

Node.js, npm, and PostgreSQL do not need to be installed locally.

Quick Start with Docker

Clone the repository:

git clone git@github.com:Codexa-net/Codexa-Website.git
cd Codexa-Website/backend

Optional: create a local environment file if you need to change the development defaults:

cp .env.example .env

Build and start the backend and PostgreSQL:

docker compose up --build -d

Check the running services:

docker compose ps

The default services will be available at:

Backend API: http://localhost:3001

Swagger UI: http://localhost:3001/api/docs

PostgreSQL: localhost:5432

Test the API:

curl http://localhost:3001

Expected response:

Hello World!

Prisma Client is generated automatically before NestJS starts.

Environment Variables

Docker Compose includes development defaults. To customize them, create a local .env file:

cp .env.example .env

Available variables:

Variable

Default

Description

APP_PORT

3001

Backend port exposed on the host machine

CORS_ORIGIN

http://localhost:3000

Frontend origin allowed to access the API

POSTGRES_PORT

5432

PostgreSQL port exposed on the host machine

POSTGRES_USER

postgres

PostgreSQL username

POSTGRES_PASSWORD

postgres

PostgreSQL password

POSTGRES_DB

codexa_db

PostgreSQL database name

DATABASE_URL

Local PostgreSQL URL

Prisma database connection URL for host commands

Multiple frontend origins can be supplied as a comma-separated value:

CORS_ORIGIN=http://localhost:3000,http://localhost:3002

Never commit the .env file, secrets, or production credentials.

Docker Services

Backend

The backend service:

Runs NestJS using Node.js 24.

Installs exact dependency versions using npm ci.

Generates Prisma Client automatically before NestJS starts.

Runs in watch mode during development.

Exposes the API through host port 3001.

Shares the source code with the host for live development.

Stores node_modules in a Docker named volume.

PostgreSQL

The PostgreSQL service:

Runs PostgreSQL 16.

Uses a health check before the backend starts.

Stores database data in a persistent Docker volume.

Remains available after stopping and restarting the containers.

Inside Docker, the backend connects to PostgreSQL using the service hostname:

postgres

Do not use localhost for communication between Docker containers. localhost is used only when connecting from the host machine.

Shared Backend Foundation

The project includes shared backend infrastructure that must not be recreated inside individual feature modules:

Global ConfigModule for environment variables.

Global PrismaModule and PrismaService.

Global request validation through ValidationPipe.

Swagger / OpenAPI setup.

CORS configuration.

Graceful Prisma connection shutdown.

Using PrismaService

Inject the shared PrismaService into a NestJS service:

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExampleService {
  constructor(private readonly prisma: PrismaService) {}
}

PrismaModule is global, so feature modules do not need to import it again.

Do not create another PrismaClient, PrismaService, or PrismaModule inside a feature branch.

Global Validation

Global validation is enabled in src/main.ts with:

whitelist: true to remove unknown properties.

forbidNonWhitelisted: true to reject unexpected properties.

transform: true to transform request values using DTO types.

Every feature module must still define validation decorators in its own DTO classes.

Example:

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ExampleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}

Swagger Documentation

Swagger UI is available at:

http://localhost:3001/api/docs

Every feature module must document its own controllers, endpoints, DTOs, parameters, and responses using NestJS Swagger decorators.

Common Docker Commands

Start the project:

docker compose up -d

Rebuild and start after dependency, lockfile, or Dockerfile changes:

docker compose up --build -d

View backend logs:

docker compose logs -f backend

View PostgreSQL logs:

docker compose logs -f postgres

Check service status:

docker compose ps

Open a shell inside the backend container:

docker compose exec backend bash

Restart only the backend:

docker compose restart backend

Stop the project:

docker compose down

Database data remains saved after docker compose down.

To delete containers and all project volumes:

docker compose down -v

Warning: docker compose down -v permanently deletes the local PostgreSQL data and dependency volumes.

Development Commands

Format the source code:

docker compose exec backend npm run format

Run ESLint:

docker compose exec backend npm run lint

Run a NestJS build check:

docker compose exec backend npm run build

Run unit tests:

docker compose exec backend npm test -- --runInBand

Run end-to-end tests:

docker compose exec backend npm run test:e2e -- --runInBand

Check production dependencies for known vulnerabilities:

docker compose exec backend npm audit --omit=dev

Do not run npm audit fix --force without technical review because it may introduce breaking dependency changes.

Prisma Commands

Prisma Client is generated automatically whenever the backend container starts.

Generate it manually after changing prisma/schema.prisma without recreating the container:

docker compose exec backend npx prisma generate

Create a development migration:

docker compose exec backend npx prisma migrate dev --name migration_name

Apply existing migrations:

docker compose exec backend npx prisma migrate deploy

Open Prisma Studio:

docker compose exec backend npx prisma studio

Prisma Studio requires an exposed host port before it can be opened from the host machine.

Coordinate all changes to prisma/schema.prisma and migration files with the backend technical lead because they are shared by all backend modules.

Generated Prisma Client files are written to src/generated/prisma and ignored by Git. Never commit or edit generated client files manually.

Project Structure

backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── generated/
│   │   └── prisma/               # Generated locally and ignored by Git
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
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
├── package-lock.json
└── README.md

The project structure will expand as application modules are implemented.

Git Workflow

The main branch contains the stable release version. The develop branch integrates completed and reviewed team tasks before release.

Each team member must create a separate branch for the assigned task.

Branch names must:

Describe the assigned task clearly.

Use lowercase English letters.

Use hyphens instead of spaces.

Contain only work related to that task.

Examples:

contact-module
portfolio-module
website-settings
admin-users

Start every task branch from the latest develop:

git switch develop
git pull --ff-only origin develop
git switch -c task-name
git push -u origin task-name

Before committing:

git status --short
git diff --check

Stage only the files related to the assigned task:

git add path/to/changed-file path/to/new-file

Commit and push:

git commit -m "type(scope): concise task description"
git push

Open a Pull Request with:

base: develop
compare: task-name

Every Pull Request must be reviewed and tested before merging. After a successful merge, the completed task branch can be deleted.

Team members must not:

Push task code directly to main or develop.

Merge a task Pull Request directly into main.

Work on unrelated tasks inside the same branch.

Duplicate shared backend infrastructure.

Add another team member's work without coordination.

Merge their own Pull Request without review.

The team should merge develop into main only when preparing a reviewed release.

Planned Backend Modules

Authentication and authorization

Admin users, roles, and permissions

Portfolio projects

Categories and technologies

Contact messages

Website settings

Social links

SEO settings

Dashboard statistics

File uploads

API documentation

Automated tests

Troubleshooting

Port 3001 is already in use

Create or edit .env:

APP_PORT=3002

Then recreate the backend:

docker compose up -d --force-recreate backend

Port 5432 is already in use

Change the PostgreSQL host port:

POSTGRES_PORT=5433

The internal Docker database port remains 5432.

Prisma Client is missing

Generate Prisma Client manually:

docker compose exec backend npx prisma generate

If the backend container is not running:

docker compose up -d

Docker Hub or npm DNS error

Errors such as EAI_AGAIN, i/o timeout, or lookup registry-1.docker.io usually indicate a temporary DNS or network issue.

Check DNS resolution and retry:

getent hosts registry.npmjs.org
getent hosts registry-1.docker.io

Do not modify dependency versions or Docker configuration solely because of a temporary DNS failure.

Port 3000 already in use inside the backend container

If NestJS watch mode reports EADDRINUSE during a file restart, recreate only the backend container:

docker compose up -d --force-recreate backend

Then verify:

curl http://localhost:3001

View startup errors

docker compose logs backend --tail=200
docker compose logs postgres --tail=200

Repository

Codexa Website on GitHub

License

This repository is private and intended for authorized Codexa team members.