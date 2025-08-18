import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { UserFactory } from 'test/factories/make-user';

describe('Authenticate (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    app.use(cookieParser());

    await app.init();
  });

  test('[PATCH] /token/refresh', async () => {
    const user = await userFactory.makePrismaUser();

    const refreshToken = jwt.sign(
      { sub: user.id.toString(), userRole: user.role },
      { expiresIn: '1s' },
    );

    const response = await request(app.getHttpServer())
      .patch('/token/refresh')
      .set('Cookie', [`unidash_refreshToken=${refreshToken}`])
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      accessToken: expect.any(String),
    });
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('unidash_refreshToken='),
    ]);
  });
});
