import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { DatabaseModule } from '@/infra/database/database.module';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { USER_ROLE } from '@/domain/entities/user';

describe('Validate Token (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /validate-token', async () => {
    const accessToken = jwt.sign({
      sub: randomUUID(),
      userRole: USER_ROLE.teacher,
      accountActivatedAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .get(`/validate-token`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
  });
});
