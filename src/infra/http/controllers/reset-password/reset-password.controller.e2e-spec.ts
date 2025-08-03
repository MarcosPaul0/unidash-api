import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';
import { UserFactory } from 'test/factories/make-user';
import { PasswordResetTokenFactory } from 'test/factories/make-password-reset-token';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Hasher } from '@/domain/application/cryptography/hasher';

describe('Reset password (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let passwordResetTokenFactory: PasswordResetTokenFactory;
  let hasher: Hasher;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PasswordResetTokenFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    passwordResetTokenFactory = moduleRef.get(PasswordResetTokenFactory);
    hasher = moduleRef.get(Hasher);

    await app.init();
  });

  test('[PATCH] /users/reset-password', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'johndoe@example.com',
      password: await hash('123456', 8),
    });

    const { token: passwordResetToken } =
      await passwordResetTokenFactory.makePrismaPasswordResetToken({
        token: '123',
        userId: user.id,
      });

    const newPassword = '123123';

    const response = await request(app.getHttpServer())
      .patch('/users/reset-password')
      .send({
        passwordResetToken,
        newPassword,
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
