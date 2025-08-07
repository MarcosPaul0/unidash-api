import { AppModule } from '@/infra/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { hash } from 'bcryptjs';
import { DatabaseModule } from '../../../database/database.module';
import { StudentFactory } from 'test/factories/make-student';
import { JwtService } from '@nestjs/jwt';

describe('Find Student (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);

    await app.init();
  });

  test('[GET] /students/me', async () => {
    const student = await studentFactory.makePrismaStudent({
      email: 'johndoe@example.com',
      password: await hash('123456', 8),
      accountActivatedAt: new Date(),
      role: 'student',
      matriculation: '1234567890',
    });

    const accessToken = jwt.sign({
      sub: student.id.toString(),
      userRole: 'student',
      accountActivatedAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .get(`/students/me`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      student: expect.objectContaining({
        email: student.email,
        id: student.id.toString(),
        name: student.name,
        role: student.role,
        matriculation: student.matriculation,
        accountActivatedAt: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    });
  });
});
