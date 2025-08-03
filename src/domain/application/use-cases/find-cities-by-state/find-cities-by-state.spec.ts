import { InMemoryCitiesRepository } from 'test/repositories/in-memory-cities-repository'
import { FindCitiesByStateUseCase } from './find-cities-by-state'
import { makeState } from 'test/factories/make-state'
import { InMemoryStatesRepository } from 'test/repositories/in-memory-states-repository'
import { makeCity } from 'test/factories/make-city'

let inMemoryCitiesRepository: InMemoryCitiesRepository
let inMemoryStatesRepository: InMemoryStatesRepository

let sut: FindCitiesByStateUseCase

describe('Find All Cities by state', () => {
  beforeEach(() => {
    inMemoryStatesRepository = new InMemoryStatesRepository()
    inMemoryCitiesRepository = new InMemoryCitiesRepository()

    sut = new FindCitiesByStateUseCase(inMemoryCitiesRepository)
  })

  it('should be able to find cities by state', async () => {
    const state = makeState()
    inMemoryStatesRepository.items.push(state)

    const city1 = makeCity({ name: 'São José dos Campos', stateId: state.id })
    const city2 = makeCity({ name: 'São Paulo', stateId: state.id })
    inMemoryCitiesRepository.items.push(city2, city1)

    const result = await sut.execute({ stateId: state.id.toString() })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({ cities: [city1, city2] })
  })
})
