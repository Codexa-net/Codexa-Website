import 'dotenv/config';
import { defineConfig } from 'prisma/config';

function getPrismaCliUrl(): string | undefined {
  const configuredDirectUrl = process.env['DIRECT_URL']?.trim();
  if (configuredDirectUrl) {
    return configuredDirectUrl;
  }
  const databaseUrl = process.env['DATABASE_URL'];
  if (!databaseUrl) {
    return undefined;
  }
  try {
    const url = new URL(databaseUrl);
    if (url.port === '6543' || url.searchParams.has('pgbouncer')) {
      url.port = '5432';
      url.searchParams.delete('pgbouncer');
      return url.toString();
    }
  } catch {
    // Falls back to regular databaseUrl if URL parsing fails
  }
  return databaseUrl;
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: getPrismaCliUrl(),
  },
});