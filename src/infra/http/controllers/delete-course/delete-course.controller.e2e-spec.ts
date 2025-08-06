import { USER_ROLE } from '@/domain/entities/user';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdminFactory } from 'test/factories/make-admin';
import { CourseFactory } from 'test/factories/make-course';

describe('Delete Course (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let courseFactory: CourseFactory;
  let adminFactory: AdminFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CourseFactory, AdminFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    courseFactory = moduleRef.get(CourseFactory);
    adminFactory = moduleRef.get(AdminFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[DELETE] /courses', async () => {
    const admin = await adminFactory.makePrismaAdmin();
    const course = await courseFactory.makePrismaCourse();

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
      userRole: USER_ROLE.admin,
      accountActivatedAt: new Date(),
    });

    const courseId = course.id.toString();

    const response = await request(app.getHttpServer())
      .delete(`/courses/${courseId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(204);

    const courseOnDatabase = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    expect(courseOnDatabase).toBeNull();
  });
});
