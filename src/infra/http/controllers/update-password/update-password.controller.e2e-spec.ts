import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { UserFactory } from 'test/factories/make-user';
import { hash } from 'bcryptjs';
import { DatabaseModule } from '@/infra/database/database.module';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Hasher } from '@/domain/application/cryptography/hasher';

describe('Update Password (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let jwt: JwtService;
  let prisma: PrismaService;
  let hasher: Hasher;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);
    hasher = moduleRef.get(Hasher);

    await app.init();
  });

  test('[PATCH] /users/password', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'johndoe@example.com',
      password: await hash('123456', 8),
    });

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      userRole: 'student',
      accountActivatedAt: new Date(),
    });

    const newPassword = '123123';

    const response = await request(app.getHttpServer())
      .patch('/users/password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        newPassword,
        oldPassword: '123456',
      });

    expect(response.statusCode).toBe(200);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: user.id.toString(),
      },
    });

    const passwordOnDatabase = userOnDatabase!.password;

    expect(await hasher.compare(newPassword, passwordOnDatabase)).toEqual(true);
  });
});
