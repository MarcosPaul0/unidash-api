import { USER_ROLE } from '@/domain/entities/user';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { StudentFactory } from 'test/factories/make-student';

describe('Delete Student (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[DELETE] /students', async () => {
    const student = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({
      sub: student.id.toString(),
      userRole: USER_ROLE.student,
      accountActivatedAt: new Date(),
    });

    const studentId = student.id.toString();

    const response = await request(app.getHttpServer())
      .delete('/students')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(204);

    const studentOnDatabase = await prisma.user.findUnique({
      where: {
        id: studentId,
      },
    });

    expect(studentOnDatabase).toBeNull();
  });
});
