import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { StudentFactory } from 'test/factories/make-student'
import { hash } from 'bcryptjs'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { UpdateStudentBodySchema } from './update-student.controller'

describe('Update Student (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    studentFactory = moduleRef.get(StudentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH] /students', async () => {
    const student = await studentFactory.makePrismaStudent({
      email: 'johndoe@example.com',
      password: await hash('123456', 8),
      accountActivatedAt: new Date(),
    })

    const accessToken = jwt.sign({
      sub: student.id.toString(),
      userRole: 'student',
      accountActivatedAt: new Date(),
    })

    const data: UpdateStudentBodySchema = {
      name: 'John Doe',
      matriculation: '1234567890',
    }

    const response = await request(app.getHttpServer())
      .patch('/students')
      .send(data)
      .set('Authorization', `Bearer ${accessToken}`)

    const updatedStudent = await prisma.user.findUnique({
      where: {
        id: student.id.toString(),
      },
      include: {
        student: true,
      },
    })

    expect(response.statusCode).toBe(200)

    expect({
      name: updatedStudent?.name,
      phone: updatedStudent?.student?.matriculation,
    }).toEqual(data)
  })
})
