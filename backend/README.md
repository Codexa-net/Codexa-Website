# Codexa Website — Backend API

Backend API for the official Codexa website, built with NestJS, TypeScript, Prisma, PostgreSQL, and JWT authentication.

## Technology Stack

- Node.js 24
- NestJS 11
- TypeScript
- PostgreSQL 16
- Prisma ORM 7
- Prisma PostgreSQL Driver Adapter
- JWT Authentication
- bcrypt Password Hashing
- NestJS Config
- Class Validator
- Class Transformer
- Swagger / OpenAPI
- Jest
- npm
- Docker
- Docker Compose

## Requirements

For the recommended Docker development setup, you only need:

- Git
- Docker
- Docker Compose

Node.js, npm, and PostgreSQL do not need to be installed locally.

## Quick Start with Docker

Clone the repository:

```bash
git clone git@github.com:Codexa-net/Codexa-Website.git
cd Codexa-Website/backend
```

Create the required local environment file:

```bash
cp .env.example .env
```

Generate a secure local JWT secret:

```bash
CODEXA_JWT_SECRET_VALUE=$(openssl rand -hex 32)

sed -i \
  "s/^JWT_SECRET=.*/JWT_SECRET=${CODEXA_JWT_SECRET_VALUE}/" \
  .env

unset CODEXA_JWT_SECRET_VALUE
```

Open `.env` and replace the initial admin password:

```env
ADMIN_SEED_PASSWORD=your_private_strong_password
```

Never commit the `.env` file or send its contents to another person.

Build and start the backend and PostgreSQL:

```bash
docker compose up --build -d
```

Apply all existing database migrations:

```bash
docker compose exec backend npx prisma migrate deploy
```

Create the initial super admin:

```bash
docker compose exec backend npm run prisma:seed
```

Check the running services:

```bash
docker compose ps
```

The default services are available at:

- Backend API: http://localhost:3001
- Swagger UI: http://localhost:3001/api/docs
- PostgreSQL: `localhost:5432`

Test the API:

```bash
curl http://localhost:3001
```

Expected response:

```text
Hello World!
```

Prisma Client is generated automatically before NestJS starts.

## Environment Variables

The project uses `.env.example` as a safe configuration template.

Create the local environment file with:

```bash
cp .env.example .env
```

Available variables:

| Variable                 | Default                 | Description                                  |
| ------------------------ | ----------------------- | -------------------------------------------- |
| `APP_PORT`               | `3001`                  | Backend port exposed on the host machine     |
| `CORS_ORIGIN`            | `http://localhost:3000` | Frontend origin allowed to access the API    |
| `POSTGRES_PORT`          | `5432`                  | PostgreSQL port exposed on the host machine  |
| `POSTGRES_USER`          | `postgres`              | PostgreSQL username                          |
| `POSTGRES_PASSWORD`      | `postgres`              | PostgreSQL development password              |
| `POSTGRES_DB`            | `codexa_db`             | PostgreSQL database name                     |
| `DATABASE_URL`           | Local PostgreSQL URL    | Prisma connection URL for host commands      |
| `JWT_SECRET`             | Required                | Secret used to sign and verify access tokens |
| `JWT_EXPIRES_IN_SECONDS` | `3600`                  | Access-token lifetime in seconds             |
| `BCRYPT_ROUNDS`          | `12`                    | Password hashing cost                        |
| `ADMIN_SEED_NAME`        | `Codexa Super Admin`    | Initial super-admin name                     |
| `ADMIN_SEED_EMAIL`       | `admin@codexa.net`      | Initial super-admin email                    |
| `ADMIN_SEED_PASSWORD`    | Required                | Initial super-admin password                 |

Multiple frontend origins can be supplied as a comma-separated value:

```env
CORS_ORIGIN=http://localhost:3000,http://localhost:3002
```

Security rules:

- Never commit `.env`.
- Never commit JWT secrets or passwords.
- Never use `.env.example` values in production.
- Use a different JWT secret for each environment.
- Use a strong production PostgreSQL password.
- Store production secrets using the hosting provider’s environment settings.

## Docker Services

### Backend

The backend service:

- Runs NestJS using Node.js 24.
- Installs exact dependency versions using `npm ci`.
- Generates Prisma Client automatically before NestJS starts.
- Runs in watch mode during development.
- Exposes the API through host port `3001`.
- Shares source code with the host for live development.
- Stores `node_modules` in a Docker named volume.
- Receives PostgreSQL, CORS, JWT, and bcrypt configuration through environment variables.

### PostgreSQL

The PostgreSQL service:

- Runs PostgreSQL 16.
- Uses a health check before the backend starts.
- Stores database data in a persistent Docker volume.
- Remains available after stopping and restarting containers.

Inside Docker, the backend connects to PostgreSQL using the service hostname:

```text
postgres
```

Do not use `localhost` for communication between Docker containers.

`localhost` is only used when connecting from the host machine.

## Shared Backend Foundation

The project includes shared backend infrastructure that must not be recreated inside individual feature modules:

- Global `ConfigModule`
- Global `PrismaModule`
- Shared `PrismaService`
- Global request validation
- Swagger / OpenAPI configuration
- CORS configuration
- Graceful Prisma shutdown
- Shared `AuthModule`
- Shared `JwtAuthGuard`
- Shared `AdminUsersService`

Feature branches must reuse these shared components.

## Using PrismaService

Inject the shared `PrismaService` into a NestJS service:

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExampleService {
  constructor(private readonly prisma: PrismaService) {}
}
```

`PrismaModule` is global, so feature modules do not need to import it again.

Do not create another:

- `PrismaClient`
- `PrismaService`
- `PrismaModule`

Generated Prisma Client files are written to:

```text
src/generated/prisma
```

This directory is ignored by Git.

Never edit or commit generated Prisma Client files manually.

## Global Validation

Global validation is enabled in `src/main.ts` with:

```ts
whitelist: true;
forbidNonWhitelisted: true;
transform: true;
```

This means:

- Unknown properties are removed or rejected.
- Unexpected request fields return `400 Bad Request`.
- Query values can be transformed using DTO types.
- Every module must define validation decorators inside its DTOs.

Example:

```ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ExampleDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;
}
```

## Swagger Documentation

Swagger UI is available at:

```text
http://localhost:3001/api/docs
```

Every feature module must document:

- Controllers
- Endpoints
- DTOs
- Query parameters
- Path parameters
- Successful responses
- Error responses
- Authentication requirements

For authenticated routes, Swagger uses:

```ts
@ApiBearerAuth()
```

This decorator only documents Bearer authentication.

Actual endpoint protection requires:

```ts
@UseGuards(JwtAuthGuard)
```

## Admin Authentication

The backend provides shared JWT authentication for admin-only APIs.

Authentication features include:

- Admin accounts stored in PostgreSQL.
- Password hashing with bcrypt.
- JWT access tokens.
- Access-token expiration.
- Active-account verification on every protected request.
- Safe admin responses without password hashes.
- Swagger Bearer authentication.
- Unit and end-to-end tests.

### Admin Roles

Available roles:

```text
SUPER_ADMIN
ADMIN
```

The initial seeded account receives:

```text
SUPER_ADMIN
```

### Create the Initial Super Admin

Configure the following values inside `.env`:

```env
ADMIN_SEED_NAME=Codexa Super Admin
ADMIN_SEED_EMAIL=admin@codexa.net
ADMIN_SEED_PASSWORD=your_private_strong_password
```

Run:

```bash
docker compose exec backend npm run prisma:seed
```

The seed command:

- Normalizes the email address.
- Validates the password length.
- Hashes the password using bcrypt.
- Creates an active `SUPER_ADMIN`.
- Does not print the password or password hash.
- Does not recreate an admin when the email already exists.
- Does not change the password of an existing admin.

### Admin Login

Endpoint:

```http
POST /auth/login
```

Request body:

```json
{
  "email": "admin@codexa.net",
  "password": "your_private_password"
}
```

Successful response:

```json
{
  "accessToken": "JWT_ACCESS_TOKEN",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "admin": {
    "id": "admin-uuid",
    "name": "Codexa Super Admin",
    "email": "admin@codexa.net",
    "role": "SUPER_ADMIN"
  }
}
```

The password and `passwordHash` are never included in the response.

Invalid email and invalid password return the same response to prevent account discovery:

```json
{
  "message": "Invalid email or password.",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### Authenticated Admin Profile

Endpoint:

```http
GET /auth/me
```

Send the token using the Authorization header:

```http
Authorization: Bearer ACCESS_TOKEN
```

Example:

```bash
curl http://localhost:3001/auth/me \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

A missing, invalid, or expired token returns:

```json
{
  "message": "Authentication is required.",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### JwtAuthGuard

Feature modules can protect admin controllers with:

```ts
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin/example')
export class ExampleAdminController {}
```

The feature module must import `AuthModule`:

```ts
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
})
export class ExampleModule {}
```

The guard verifies:

1. The Authorization header uses `Bearer`.
2. The JWT signature is valid.
3. The token has not expired.
4. The token contains an admin ID.
5. The admin still exists.
6. The admin account is active.

The guard loads the latest admin data from PostgreSQL instead of trusting role or profile data stored only inside the token.

## Contact Module

The Contact Module provides:

- Public contact-form submission.
- Message validation.
- Messages CRUD.
- Search.
- Read/unread filtering.
- Pagination.
- Mark as read.
- Delete message.
- Swagger documentation.
- Unit tests.
- JWT-protected admin routes.

### Public Contact Form

Endpoint:

```http
POST /contact
```

Authentication is not required.

Example request:

```json
{
  "name": "Ahmed Mohamed",
  "email": "ahmed@example.com",
  "phone": "+201012345678",
  "subject": "Website development request",
  "message": "I would like to discuss building a company website."
}
```

The public user cannot submit internal properties such as:

```text
isRead
readAt
createdAt
updatedAt
```

Unexpected properties are rejected by global validation.

### Protected Contact Message Endpoints

The following routes require a valid admin JWT:

```http
GET    /admin/messages
GET    /admin/messages/:id
PATCH  /admin/messages/:id/read
DELETE /admin/messages/:id
```

Available list query parameters:

| Parameter | Default | Description                              |
| --------- | ------- | ---------------------------------------- |
| `page`    | `1`     | Requested pagination page                |
| `limit`   | `10`    | Number of results, maximum `100`         |
| `search`  | Empty   | Search name, email, subject, and message |
| `isRead`  | Empty   | Filter by `true` or `false`              |

Example:

```http
GET /admin/messages?page=1&limit=10&search=website&isRead=false
```

## Common Docker Commands

Start the project:

```bash
docker compose up -d
```

Build and start after dependency, lockfile, or Dockerfile changes:

```bash
docker compose up --build -d
```

Recreate only the backend container:

```bash
docker compose up -d --force-recreate backend
```

Restart only the backend:

```bash
docker compose restart backend
```

Check service status:

```bash
docker compose ps
```

View backend logs:

```bash
docker compose logs -f backend
```

View PostgreSQL logs:

```bash
docker compose logs -f postgres
```

Open a shell inside the backend container:

```bash
docker compose exec backend bash
```

Stop the project:

```bash
docker compose down
```

Database data remains saved after `docker compose down`.

Delete containers and all project volumes:

```bash
docker compose down -v
```

> Warning: `docker compose down -v` permanently deletes local PostgreSQL data and dependency volumes.

## Development Commands

Format source code:

```bash
docker compose exec backend npm run format
```

Run ESLint:

```bash
docker compose exec backend npm run lint
```

Run a NestJS build check:

```bash
docker compose exec backend npm run build
```

Run unit tests:

```bash
docker compose exec backend npm test -- --runInBand
```

Run end-to-end tests:

```bash
docker compose exec backend npm run test:e2e -- --runInBand
```

Check production dependencies for known vulnerabilities:

```bash
docker compose exec backend npm audit --omit=dev
```

Do not run:

```bash
npm audit fix --force
```

without technical review because it may introduce breaking dependency changes.

## Prisma Commands

Prisma Client is generated automatically whenever the backend container starts.

Generate Prisma Client manually:

```bash
docker compose exec backend npx prisma generate
```

Format Prisma Schema:

```bash
docker compose exec backend npx prisma format
```

Validate Prisma Schema:

```bash
docker compose exec backend npx prisma validate
```

Create a development migration:

```bash
docker compose exec backend npx prisma migrate dev \
  --name migration_name
```

Apply existing migrations:

```bash
docker compose exec backend npx prisma migrate deploy
```

Check migration status:

```bash
docker compose exec backend npx prisma migrate status
```

Create the initial super admin:

```bash
docker compose exec backend npm run prisma:seed
```

Open Prisma Studio:

```bash
docker compose exec backend npx prisma studio
```

Prisma Studio requires an exposed host port before it can be accessed from the host machine.

Coordinate all changes to:

```text
prisma/schema.prisma
prisma/migrations/
```

with the backend technical lead because these files are shared by all backend modules.

Never edit an existing migration after it has been shared or applied by other team members.

## Project Structure

```text
backend/
├── prisma/
│   ├── migrations/
│   │   ├── create_contact_messages/
│   │   └── create_admin_users/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── admin-users/
│   │   ├── admin-users.module.ts
│   │   ├── admin-users.service.ts
│   │   └── admin-users.service.spec.ts
│   ├── auth/
│   │   ├── dto/
│   │   │   └── login.dto.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── jwt-auth.guard.spec.ts
│   │   ├── interfaces/
│   │   │   ├── authenticated-admin.interface.ts
│   │   │   └── jwt-payload.interface.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.controller.spec.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── auth.service.spec.ts
│   ├── contact/
│   │   ├── dto/
│   │   │   ├── create-contact-message.dto.ts
│   │   │   └── list-contact-messages-query.dto.ts
│   │   ├── admin-messages.controller.ts
│   │   ├── admin-messages.controller.spec.ts
│   │   ├── contact.controller.ts
│   │   ├── contact.controller.spec.ts
│   │   ├── contact.module.ts
│   │   ├── contact.service.ts
│   │   └── contact.service.spec.ts
│   ├── generated/
│   │   └── prisma/                 # Generated locally and ignored by Git
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
│   ├── app.e2e-spec.ts
│   ├── auth.e2e-spec.ts
│   └── jest-e2e.json
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── package-lock.json
└── README.md
```

Generated files inside `src/generated/prisma` are ignored by Git and must be regenerated locally.

## Testing Strategy

The backend uses:

- Unit tests for controllers.
- Unit tests for services.
- Unit tests for guards.
- Mocked Prisma dependencies in unit tests.
- Real bcrypt password comparison tests.
- End-to-end authentication tests.
- End-to-end protected-route tests.

Before opening a Pull Request, run:

```bash
docker compose exec backend npm run format
docker compose exec backend npm run lint
docker compose exec backend npm run build
docker compose exec backend npm test -- --runInBand
docker compose exec backend npm run test:e2e -- --runInBand
docker compose exec backend npx prisma validate
docker compose exec backend npm audit --omit=dev
git diff --check
```

All checks must pass before review.

## Git Workflow

The `main` branch contains the stable production-ready version.

The `develop` branch integrates completed team tasks before release.

Every task must use a separate branch created from the latest required base branch.

Start a task:

```bash
git switch develop
git pull --ff-only origin develop
git switch -c task-name
git push -u origin task-name
```

Replace `task-name` with a clear branch name.

Examples:

```text
contact-module
admin-auth-jwt
portfolio-module
website-settings
```

After completing a task:

```bash
git add specific-file-or-directory
git commit -m "type(scope): clear description"
git push origin task-name
```

Then open a Pull Request from the task branch into `develop`.

Every Pull Request must:

- Have a clear title and description.
- Explain the implemented features.
- Include database changes.
- Include environment-variable changes.
- Include test results.
- Be reviewed before merge.
- Target `develop`, not `main`.

Team members must not:

- Push feature code directly to `main`.
- Push feature code directly to `develop`.
- Mix unrelated tasks in one branch.
- Commit `.env`.
- Commit generated Prisma Client.
- Commit `node_modules`.
- Merge their own Pull Request without review.
- Run destructive database commands without coordination.

After a successful merge, the task branch can be deleted.

## Planned Backend Modules

- Admin users CRUD
- Roles and permissions
- Admin profile
- Change password
- Portfolio projects
- Portfolio categories
- Technologies
- Featured projects
- Website settings
- About Us
- Company information
- Social links
- SEO settings
- Contact information
- Dashboard statistics
- File uploads
- Logger
- Global exception filter
- Rate limiter
- Health check

## Troubleshooting

### JWT_SECRET Is Required

If Docker Compose reports:

```text
JWT_SECRET_is_required
```

Create `.env` and configure a secure JWT secret:

```bash
cp .env.example .env
```

Then replace `JWT_SECRET` before starting Docker.

### Port 3001 Is Already in Use

Change the backend host port inside `.env`:

```env
APP_PORT=3002
```

Recreate the backend:

```bash
docker compose up -d --force-recreate backend
```

### Port 5432 Is Already in Use

Change the PostgreSQL host port:

```env
POSTGRES_PORT=5433
```

The internal Docker PostgreSQL port remains `5432`.

### Backend Returns HTTP 000

Check container status and logs:

```bash
docker compose ps
docker compose logs backend --tail=200
```

`HTTP 000` usually means the backend is still starting or stopped because of a configuration or dependency-injection error.

### Prisma Client Is Missing

Generate Prisma Client:

```bash
docker compose exec backend npx prisma generate
```

The Docker backend command normally generates it automatically.

### Database Is Not in Sync

Check migration status:

```bash
docker compose exec backend npx prisma migrate status
```

Apply existing migrations:

```bash
docker compose exec backend npx prisma migrate deploy
```

Do not reset a shared database without approval.

### Admin Already Exists

The seed command is idempotent.

If the configured admin email already exists, it prints:

```text
Super admin already exists
```

and does not change the existing password.

### View Startup Errors

```bash
docker compose logs backend --tail=200
docker compose logs postgres --tail=200
```

## Repository

[Codexa Website on GitHub](https://github.com/Codexa-net/Codexa-Website)

## License

This repository is private and intended only for authorized Codexa team members.
