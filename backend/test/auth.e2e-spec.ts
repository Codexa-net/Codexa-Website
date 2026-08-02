import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

interface LoginResponseBody {
  accessToken?: unknown;
  tokenType?: unknown;
  expiresIn?: unknown;
  admin?: {
    email?: unknown;
    role?: unknown;
  };
}

interface ProfileResponseBody {
  data?: {
    email?: unknown;
    role?: unknown;
    isActive?: unknown;
  };
}

interface MessagesResponseBody {
  data?: unknown;
  meta?: {
    page?: unknown;
    limit?: unknown;
    total?: unknown;
  };
}

describe('Authentication (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  const testAdmin = {
    name: 'Auth E2E Admin',
    email: 'auth-e2e@codexa.net',
    password: 'E2ePassword123!',
  };

  async function loginAndGetToken(): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testAdmin.email,
        password: testAdmin.password,
      })
      .expect(200);

    const body = response.body as LoginResponseBody;

    if (typeof body.accessToken !== 'string') {
      throw new Error('Login response did not contain an access token.');
    }

    return body.accessToken;
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    await prisma.adminUser.deleteMany({
      where: {
        email: testAdmin.email,
      },
    });

    const passwordHash = await bcrypt.hash(testAdmin.password, 4);

    await prisma.adminUser.create({
      data: {
        name: testAdmin.name,
        email: testAdmin.email,
        passwordHash,
        role: 'ADMIN',
        isActive: true,
      },
    });
  });

  afterAll(async () => {
    await prisma.adminUser.deleteMany({
      where: {
        email: testAdmin.email,
      },
    });

    await app.close();
  });

  it('should validate the login request', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'invalid-email',
        password: 'short',
        unexpectedField: true,
      })
      .expect(400);
  });

  it('should reject an invalid password', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testAdmin.email,
        password: 'WrongPassword123!',
      })
      .expect(401);
  });

  it('should authenticate an admin and return a token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testAdmin.email,
        password: testAdmin.password,
      })
      .expect(200);

    const body = response.body as LoginResponseBody;

    expect(typeof body.accessToken).toBe('string');
    expect(body.tokenType).toBe('Bearer');
    expect(body.expiresIn).toBe(3600);
    expect(body.admin?.email).toBe(testAdmin.email);
    expect(body.admin?.role).toBe('ADMIN');
  });

  it('should reject a protected route without a token', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('should return the authenticated admin profile', async () => {
    const accessToken = await loginAndGetToken();

    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const body = response.body as ProfileResponseBody;

    expect(body.data?.email).toBe(testAdmin.email);
    expect(body.data?.role).toBe('ADMIN');
    expect(body.data?.isActive).toBe(true);
  });

  it('should protect and return admin contact messages', async () => {
    const accessToken = await loginAndGetToken();

    const response = await request(app.getHttpServer())
      .get('/admin/messages?page=1&limit=10')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    const body = response.body as MessagesResponseBody;

    expect(Array.isArray(body.data)).toBe(true);
    expect(body.meta?.page).toBe(1);
    expect(body.meta?.limit).toBe(10);
    expect(typeof body.meta?.total).toBe('number');
  });
});
