import { USER_ROLE } from '@/domain/entities/user';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdminFactory } from 'test/factories/make-admin';
import { CourseFactory } from 'test/factories/make-course';

describe('Update Course (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let courseFactory: CourseFactory;
  let adminFactory: AdminFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [AdminFactory, CourseFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    adminFactory = moduleRef.get(AdminFactory);
    courseFactory = moduleRef.get(CourseFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PATCH] /courses', async () => {
    const admin = await adminFactory.makePrismaAdmin();
    const course = await courseFactory.makePrismaCourse({
      name: 'Fake course 1',
    });

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
      userRole: USER_ROLE.admin,
      accountActivatedAt: new Date(),
    });

    const courseId = course.id.toString();

    const response = await request(app.getHttpServer())
      .patch(`/courses/${courseId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Fake course 2',
      });

    expect(response.statusCode).toBe(201);

    const courseOnDatabase = await prisma.course.findUnique({
      where: {
        name: 'Fake course 2',
      },
    });

    expect(courseOnDatabase).toBeTruthy();
  });
});
