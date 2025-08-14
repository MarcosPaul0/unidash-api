import { InMemoryCourseCoordinationDataRepository } from 'test/repositories/in-memory-course-coordination-data-repository';
import { FindAllCourseCoordinationDataUseCase } from './find-all-course-coordination-data';
import { makeCourseCoordinationData } from 'test/factories/make-course-coordination-data';

let inMemoryCourseCoordinationDataRepository: InMemoryCourseCoordinationDataRepository;

let sut: FindAllCourseCoordinationDataUseCase;

describe('Find All Course Coordination Data', () => {
  beforeEach(() => {
    inMemoryCourseCoordinationDataRepository =
      new InMemoryCourseCoordinationDataRepository();
    sut = new FindAllCourseCoordinationDataUseCase(
      inMemoryCourseCoordinationDataRepository,
    );
  });

  it('should be able to find all course coordination data', async () => {
    const courseCoordinationData1 = makeCourseCoordinationData();
    const courseCoordinationData2 = makeCourseCoordinationData();
    const courseCoordinationData3 = makeCourseCoordinationData();

    inMemoryCourseCoordinationDataRepository.courseCoordinationData.push(
      courseCoordinationData1,
      courseCoordinationData2,
      courseCoordinationData3,
    );

    const result = await sut.execute({
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'first', year: 2025 },
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseCoordinationData: [
        courseCoordinationData1,
        courseCoordinationData2,
      ],
      totalItems: 3,
      totalPages: 2,
    });
  });

  it('should be able to find all course coordination data with filters', async () => {
    const courseCoordinationData1 = makeCourseCoordinationData({
      semester: 'first',
      year: 2025,
    });
    const courseCoordinationData2 = makeCourseCoordinationData({
      semester: 'second',
      year: 2025,
    });
    const courseCoordinationData3 = makeCourseCoordinationData({
      semester: 'second',
      year: 2024,
    });

    inMemoryCourseCoordinationDataRepository.courseCoordinationData.push(
      courseCoordinationData1,
      courseCoordinationData2,
      courseCoordinationData3,
    );

    const result = await sut.execute({
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'second', year: 2024 },
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseCoordinationData: [courseCoordinationData3],
      totalItems: 1,
      totalPages: 1,
    });
  });
});
