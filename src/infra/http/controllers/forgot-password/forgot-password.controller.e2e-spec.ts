import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'

describe('Forgot Password (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /forgot-password', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'johndoe@example.com',
    })

    const response = await request(app.getHttpServer())
      .post('/forgot-password')
      .send({
        email: 'johndoe@example.com',
      })

    expect(response.statusCode).toBe(200)

    const passwordResetTokenOnDatabase = await prisma.userActionToken.findFirst(
      {
        where: {
          userId: user.id.toString(),
          actionType: 'passwordReset',
        },
      },
    )

    expect(passwordResetTokenOnDatabase).toBeTruthy()
    expect(passwordResetTokenOnDatabase).toMatchObject(
      expect.objectContaining({
        actionType: 'passwordReset',
        token: expect.any(String),
        userId: user.id.toString(),
      }),
    )
  })
})
