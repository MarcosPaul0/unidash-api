import { USER_ROLE } from '@/domain/entities/user';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdminFactory } from 'test/factories/make-admin';

describe('Create Course (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminFactory: AdminFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [AdminFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    adminFactory = moduleRef.get(AdminFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /courses', async () => {
    const admin = await adminFactory.makePrismaAdmin();

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
      userRole: USER_ROLE.admin,
      accountActivatedAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .post('/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'fake course',
      });

    expect(response.statusCode).toBe(201);

    const courseOnDatabase = await prisma.course.findUnique({
      where: {
        name: 'fake course',
      },
    });

    expect(courseOnDatabase).toBeTruthy();
  });
});
