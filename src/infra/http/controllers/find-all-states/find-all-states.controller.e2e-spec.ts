import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '../../../database/database.module'
import { StateFactory } from 'test/factories/make-state'

describe('Find All States (E2E)', () => {
  let app: INestApplication
  let stateFactory: StateFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StateFactory],
    }).compile()

    stateFactory = moduleRef.get(StateFactory)

    app = moduleRef.createNestApplication()

    await app.init()
  })

  test('[GET] /states', async () => {
    const state = await stateFactory.makePrismaState()

    const response = await request(app.getHttpServer()).get('/states').send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      states: [
        expect.objectContaining({
          id: state.id.toString(),
          name: expect.any(String),
        }),
      ],
    })
  })
})
