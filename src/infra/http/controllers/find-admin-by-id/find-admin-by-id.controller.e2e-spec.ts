import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { DatabaseModule } from '../../../database/database.module'
import { AdminFactory } from 'test/factories/make-admin'
import { JwtService } from '@nestjs/jwt'

describe('Find Admin By Id (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test('[GET] /admin/me', async () => {
    const admin = await adminFactory.makePrismaAdmin({
      email: 'johndoe@example.com',
      password: await hash('123456', 8),
      accountActivatedAt: new Date(),
      role: 'ADMIN',
    })

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
      userRole: 'ADMIN',
      accountActivatedAt: new Date(),
    })

    const response = await request(app.getHttpServer())
      .get(`/admin/me`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      admin: expect.objectContaining({
        email: admin.email,
        id: admin.id.toString(),
        name: admin.name,
        role: admin.role,
        accountActivatedAt: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    })
  })
})
