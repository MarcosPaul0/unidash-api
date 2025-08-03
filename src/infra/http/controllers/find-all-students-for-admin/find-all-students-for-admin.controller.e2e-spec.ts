import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { StudentFactory } from 'test/factories/make-student'
import { AdminFactory } from 'test/factories/make-admin'

describe('Find All students For Admin (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let adminFactory: AdminFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)
    studentFactory = moduleRef.get(StudentFactory)

    await app.init()
  })

  test('[GET] /students/for-admin', async () => {
    await studentFactory.makePrismaStudent({
      createdAt: new Date(2000, 1),
    })

    const student1 = await studentFactory.makePrismaStudent({
      createdAt: new Date(2000, 2),
    })

    const student2 = await studentFactory.makePrismaStudent({
      createdAt: new Date(2000, 3),
    })

    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
      userRole: 'admin',
      accountActivatedAt: new Date(),
    })

    // testa paginação
    const response = await request(app.getHttpServer())
      .get('/students/for-admin?page=1&itemsPerPage=2')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      students: [
        expect.objectContaining({
          id: student2.id.toString(),
        }),
        expect.objectContaining({
          id: student1.id.toString(),
        }),
      ],
      totalItems: 3,
      totalPages: 2,
    })
  })
})
