import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { TeacherFactory } from '../../../../../test/factories/make-teacher'
import { hash } from 'bcryptjs'
import { DatabaseModule } from '../../../database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { UpdateTeacherBodySchema } from './update-teacher.controller'

describe('Update Teacher (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let teacherFactory: TeacherFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [TeacherFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    teacherFactory = moduleRef.get(TeacherFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH] /teachers', async () => {
    const teacher = await teacherFactory.makePrismaTeacher({
      email: 'johndoe@example.com',
      password: await hash('123456', 8),
      accountActivatedAt: new Date(),
    })

    const accessToken = jwt.sign({
      sub: teacher.id.toString(),
      userRole: 'teacher',
      accountActivatedAt: new Date(),
    })

    const data: UpdateTeacherBodySchema = {
      name: 'Test',
      teacherRole: 'courseManagerTeacher',
    }

    const response = await request(app.getHttpServer())
      .patch('/teachers')
      .send(data)
      .set('Authorization', `Bearer ${accessToken}`)

    const updatedTeacher = await prisma.user.findUnique({
      where: {
        id: teacher.id.toString(),
      },
      include: {
        teacher: true,
      },
    })

    expect(response.statusCode).toBe(200)

    expect(updatedTeacher).toEqual(
      expect.objectContaining({
        name: 'Test',
        teacher: expect.objectContaining({
          legalName: 'Test',
          phone: '12112356789',
        }),
      }),
    )
  })
})
