import { InMemoryStatesRepository } from 'test/repositories/in-memory-states-repository'
import { FindAllStatesUseCase } from './find-all-states'
import { makeState } from 'test/factories/make-state'

let inMemoryStatesRepository: InMemoryStatesRepository

let sut: FindAllStatesUseCase

describe('Find All States', () => {
  beforeEach(() => {
    inMemoryStatesRepository = new InMemoryStatesRepository()

    sut = new FindAllStatesUseCase(inMemoryStatesRepository)
  })

  it('should be able to find all states', async () => {
    const state1 = makeState({ name: 'SP' })
    const state2 = makeState({ name: 'RJ' })

    inMemoryStatesRepository.items.push(state1, state2)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({ state: [state2, state1] })
  })
})
