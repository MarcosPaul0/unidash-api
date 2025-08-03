import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountActivationTokenFactory } from 'test/factories/make-account-activation-token'
import { UserFactory } from 'test/factories/make-user'

describe('Resend Account Confirmation Email (E2E)', () => {
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

    userFactory = moduleRef.get(UserFactory)
    accountActivationTokenFactory = moduleRef.get(AccountActivationTokenFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /resend-confirmation', async () => {
    const user = await userFactory.makePrismaUser({
      email: 'johndoe@example.com',
    })

    const oldActivationToken =
      await accountActivationTokenFactory.makePrismaAccountActivationToken({
        userId: user.id,
      })

    const response = await request(app.getHttpServer())
      .post('/resend-confirmation-email')
      .send({
        email: 'johndoe@example.com',
      })

    expect(response.statusCode).toBe(200)

    const activationTokenOnDatabase = await prisma.userActionToken.findFirst({
      where: {
        userId: user.id.toString(),
        actionType: 'accountConfirmation',
      },
    })

    expect(activationTokenOnDatabase).toBeTruthy()
    expect(activationTokenOnDatabase).not.equal(oldActivationToken)
  })
})
