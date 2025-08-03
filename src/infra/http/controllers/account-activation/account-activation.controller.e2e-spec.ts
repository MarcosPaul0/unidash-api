import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'
import { AccountActivationTokenFactory } from 'test/factories/make-account-activation-token'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Account activation (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let accountActivationTokenFactory: AccountActivationTokenFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, AccountActivationTokenFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    accountActivationTokenFactory = moduleRef.get(AccountActivationTokenFactory)

    await app.init()
  })

  test('[PATCH] /account-activation', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'johndoe@example.com',
      password: await hash('123456', 8),
    })

    await accountActivationTokenFactory.makePrismaAccountActivationToken({
      token: '123',
      userId: user.id,
    })

    const response = await request(app.getHttpServer())
      .patch('/account-activation/123')
      .send()

    expect(response.statusCode).toBe(200)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: user.id.toString(),
      },
    })

    expect(userOnDatabase?.accountActivatedAt).toEqual(expect.any(Date))

    const accountActivationTokenOnDatabase =
      await prisma.userActionToken.findUnique({
        where: {
          token: '123',
          actionType: 'accountConfirmation',
        },
      })

    expect(accountActivationTokenOnDatabase).toBeFalsy()
  })
})
