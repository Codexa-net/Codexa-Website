import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Contact rate limiting (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  const testEmail = 'contact-rate-limit-e2e@example.com';

  const contactMessage = {
    name: 'Rate Limit Test',
    email: testEmail,
    subject: 'Rate limiter verification',
    message: 'This temporary message is used to verify contact rate limiting.',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await prisma.contactMessage.deleteMany({
      where: {
        email: testEmail,
      },
    });

    await app.close();
  });

  it('should allow five requests and reject the sixth request', async () => {
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      await request(app.getHttpServer())
        .post('/contact')
        .send({
          ...contactMessage,
          subject: `Rate limiter verification ${attempt}`,
        })
        .expect(201);
    }

    await request(app.getHttpServer())
      .post('/contact')
      .send({
        ...contactMessage,
        subject: 'Rate limiter blocked request',
      })
      .expect(429);
  });
});
