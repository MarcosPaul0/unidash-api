import { USER_ROLE } from '@/domain/entities/user';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdminFactory } from 'test/factories/make-admin';

describe('Register Teacher Account (E2E)', () => {
  let app: INestApplication;
  let adminFactory: AdminFactory;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [AdminFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    adminFactory = moduleRef.get(AdminFactory);
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /teachers', async () => {
    const admin = await adminFactory.makePrismaAdmin();

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
      userRole: USER_ROLE.admin,
      accountActivatedAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .post('/teachers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'teacher',
        email: 'teacher@example.com',
        password: '123456',
      });

    expect(response.statusCode).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'teacher@example.com',
      },
    });

    expect(userOnDatabase).toBeTruthy();
  });
});
