import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { hash } from 'bcryptjs';
import { DatabaseModule } from '../../../database/database.module';
import { TeacherFactory } from 'test/factories/make-teacher';
import { JwtService } from '@nestjs/jwt';
import { USER_ROLE } from '@/domain/entities/user';

describe('Find Teacher By Id (E2E)', () => {
  let app: INestApplication;
  let teacherFactory: TeacherFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [TeacherFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);
    teacherFactory = moduleRef.get(TeacherFactory);

    await app.init();
  });

  test('[GET] /teacher/me', async () => {
    const teacher = await teacherFactory.makePrismaTeacher({
      email: 'johndoe@example.com',
      password: await hash('123456', 8),
      accountActivatedAt: new Date(),
      role: USER_ROLE.teacher,
    });

    const accessToken = jwt.sign({
      sub: teacher.id.toString(),
      userRole: USER_ROLE.teacher,
      accountActivatedAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .get(`/teacher/me`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      teacher: expect.objectContaining({
        id: teacher.id.toString(),
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        teacherRole: teacher.teacherRole,
        accountActivatedAt: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    });
  });
});
