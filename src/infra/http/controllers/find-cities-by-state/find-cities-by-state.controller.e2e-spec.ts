import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DatabaseModule } from '../../../database/database.module'
import { StateFactory } from 'test/factories/make-state'
import { CityFactory } from 'test/factories/make-city'

describe('Find Cities By State (E2E)', () => {
  let app: INestApplication
  let stateFactory: StateFactory
  let cityFactory: CityFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StateFactory, CityFactory],
    }).compile()

    stateFactory = moduleRef.get(StateFactory)
    cityFactory = moduleRef.get(CityFactory)

    app = moduleRef.createNestApplication()

    await app.init()
  })

  test('[GET] /cities/:stateId', async () => {
    const state = await stateFactory.makePrismaState()
    const city = await cityFactory.makePrismaCity({
      stateId: state.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/cities/${state.id.toString()}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      cities: [
        expect.objectContaining({
          id: city.id.toString(),
          name: expect.any(String),
        }),
      ],
    })
  })
})
