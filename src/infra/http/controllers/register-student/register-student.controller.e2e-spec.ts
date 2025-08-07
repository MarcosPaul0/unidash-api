import { USER_ROLE } from '@/domain/entities/user';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CourseFactory } from 'test/factories/make-course';
import { TeacherFactory } from 'test/factories/make-teacher';
import { TeacherCourseFactory } from 'test/factories/make-teacher-course';

describe('Register Student (E2E)', () => {
  let app: INestApplication;
  let teacherFactory: TeacherFactory;
  let courseFactory: CourseFactory;
  let teacherCourseFactory: TeacherCourseFactory;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [TeacherFactory, CourseFactory, TeacherCourseFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    teacherFactory = moduleRef.get(TeacherFactory);
    courseFactory = moduleRef.get(CourseFactory);
    teacherCourseFactory = moduleRef.get(TeacherCourseFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /students', async () => {
    const teacher = await teacherFactory.makePrismaTeacher();
    const course = await courseFactory.makePrismaCourse();
    await teacherCourseFactory.makeTeacherCourse({
      course,
      teacher,
    });

    const accessToken = jwt.sign({
      sub: teacher.id.toString(),
      userRole: USER_ROLE.teacher,
      accountActivatedAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .post('/students')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
        matriculation: '1234567890',
      });

    expect(response.statusCode).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    });

    expect(userOnDatabase).toBeTruthy();
  });
});
