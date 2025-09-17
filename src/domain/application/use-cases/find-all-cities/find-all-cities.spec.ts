import { InMemoryCitiesRepository } from 'test/repositories/in-memory-cities-repository';
import { makeState } from 'test/factories/make-state';
import { InMemoryStatesRepository } from 'test/repositories/in-memory-states-repository';
import { makeCity } from 'test/factories/make-city';
import { FindAllCitiesUseCase } from './find-all-cities';

let inMemoryCitiesRepository: InMemoryCitiesRepository;
let inMemoryStatesRepository: InMemoryStatesRepository;

let sut: FindAllCitiesUseCase;

describe('Find All Cities', () => {
  beforeEach(() => {
    inMemoryStatesRepository = new InMemoryStatesRepository();
    inMemoryCitiesRepository = new InMemoryCitiesRepository();

    sut = new FindAllCitiesUseCase(inMemoryCitiesRepository);
  });

  it('should be able to find cities', async () => {
    const state = makeState();
    inMemoryStatesRepository.items.push(state);

    const city1 = makeCity({
      name: 'São José dos Campos',
      stateId: state.id.toString(),
    });
    const city2 = makeCity({ name: 'São Paulo', stateId: state.id.toString() });
    inMemoryCitiesRepository.cities.push(city2, city1);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ cities: [city1, city2] });
  });
});
