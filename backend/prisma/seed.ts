import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client';

function getRequiredEnvironmentValue(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

const connectionString = getRequiredEnvironmentValue('DATABASE_URL');

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function seed(): Promise<void> {
  const name = getRequiredEnvironmentValue('ADMIN_SEED_NAME').trim();
  const email = getRequiredEnvironmentValue('ADMIN_SEED_EMAIL')
    .trim()
    .toLowerCase();
  const password = getRequiredEnvironmentValue('ADMIN_SEED_PASSWORD');
  const bcryptRounds = Number(process.env.BCRYPT_ROUNDS ?? '12');

  if (password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    throw new Error('ADMIN_SEED_PASSWORD must be between 8 and 72 bytes.');
  }

  if (
    !Number.isInteger(bcryptRounds) ||
    bcryptRounds < 10 ||
    bcryptRounds > 14
  ) {
    throw new Error('BCRYPT_ROUNDS must be between 10 and 14.');
  }

  const existingAdmin = await prisma.adminUser.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (existingAdmin) {
    console.log(`Super admin already exists: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, bcryptRounds);

  await prisma.adminUser.create({
    data: {
      name,
      email,
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  console.log(`Super admin created successfully: ${email}`);
}

void seed()
  .catch((error: unknown) => {
    console.error('Failed to seed the super admin.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
