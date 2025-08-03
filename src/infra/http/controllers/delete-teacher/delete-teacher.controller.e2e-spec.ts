import { USER_ROLE } from '@/domain/entities/user';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { TeacherFactory } from 'test/factories/make-teacher';

describe('Delete Teacher (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let teacherFactory: TeacherFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [TeacherFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    teacherFactory = moduleRef.get(TeacherFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[DELETE] /teachers', async () => {
    const teacher = await teacherFactory.makePrismaTeacher();

    const accessToken = jwt.sign({
      sub: teacher.id.toString(),
      userRole: USER_ROLE.teacher,
      accountActivatedAt: new Date(),
    });

    const teacherId = teacher.id.toString();

    const response = await request(app.getHttpServer())
      .delete('/teachers')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(204);

    const teacherOnDatabase = await prisma.user.findUnique({
      where: {
        id: teacherId,
      },
    });

    expect(teacherOnDatabase).toBeNull();
  });
});
