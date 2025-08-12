import { FindAllCourseDepartureDataUseCase } from './find-all-course-departure-data';
import { InMemoryCourseDepartureDataRepository } from 'test/repositories/in-memory-course-departure-data-repository';
import { makeCourseDepartureData } from 'test/factories/make-course-departure-data';

let inMemoryCourseDepartureDataRepository: InMemoryCourseDepartureDataRepository;

let sut: FindAllCourseDepartureDataUseCase;

describe('Find All Course Departure Data', () => {
  beforeEach(() => {
    inMemoryCourseDepartureDataRepository =
      new InMemoryCourseDepartureDataRepository();
    sut = new FindAllCourseDepartureDataUseCase(
      inMemoryCourseDepartureDataRepository,
    );
  });

  it('should be able to find all course departure data', async () => {
    const courseDepartureData1 = makeCourseDepartureData();
    const courseDepartureData2 = makeCourseDepartureData();
    const courseDepartureData3 = makeCourseDepartureData();

    inMemoryCourseDepartureDataRepository.courseDepartureData.push(
      courseDepartureData1,
      courseDepartureData2,
      courseDepartureData3,
    );

    const result = await sut.execute({
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'first', year: 2025 },
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseDepartureData: [courseDepartureData1, courseDepartureData2],
      totalItems: 3,
      totalPages: 2,
    });
  });

  it('should be able to find all course departure data with filters', async () => {
    const courseDepartureData1 = makeCourseDepartureData({
      semester: 'first',
      year: 2025,
    });
    const courseDepartureData2 = makeCourseDepartureData({
      semester: 'second',
      year: 2025,
    });
    const courseDepartureData3 = makeCourseDepartureData({
      semester: 'second',
      year: 2024,
    });

    inMemoryCourseDepartureDataRepository.courseDepartureData.push(
      courseDepartureData1,
      courseDepartureData2,
      courseDepartureData3,
    );

    const result = await sut.execute({
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'second', year: 2024 },
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseDepartureData: [courseDepartureData3],
      totalItems: 1,
      totalPages: 1,
    });
  });
});
