import { InMemoryCourseRegistrationLockDataRepository } from 'test/repositories/in-memory-course-registration-lock-data-repository';
import { FindAllCourseRegistrationLockDataUseCase } from './find-all-course-registration-lock-data';
import { makeCourseRegistrationLockData } from 'test/factories/make-course-registration-lock-data';

let inMemoryCourseRegistrationLockDataRepository: InMemoryCourseRegistrationLockDataRepository;

let sut: FindAllCourseRegistrationLockDataUseCase;

describe('Find All Course Registration Lock Data', () => {
  beforeEach(() => {
    inMemoryCourseRegistrationLockDataRepository =
      new InMemoryCourseRegistrationLockDataRepository();
    sut = new FindAllCourseRegistrationLockDataUseCase(
      inMemoryCourseRegistrationLockDataRepository,
    );
  });

  it('should be able to find all course registration lock data', async () => {
    const courseRegistrationLockData1 = makeCourseRegistrationLockData();
    const courseRegistrationLockData2 = makeCourseRegistrationLockData();
    const courseRegistrationLockData3 = makeCourseRegistrationLockData();

    inMemoryCourseRegistrationLockDataRepository.courseRegistrationLockData.push(
      courseRegistrationLockData1,
      courseRegistrationLockData2,
      courseRegistrationLockData3,
    );

    const result = await sut.execute({
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'first', year: 2025 },
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseRegistrationLockData: [
        courseRegistrationLockData1,
        courseRegistrationLockData2,
      ],
      totalItems: 3,
      totalPages: 2,
    });
  });

  it('should be able to find all course registration lock data with filters', async () => {
    const courseRegistrationLockData1 = makeCourseRegistrationLockData({
      semester: 'first',
      year: 2025,
    });
    const courseRegistrationLockData2 = makeCourseRegistrationLockData({
      semester: 'second',
      year: 2025,
    });
    const courseRegistrationLockData3 = makeCourseRegistrationLockData({
      semester: 'second',
      year: 2024,
    });

    inMemoryCourseRegistrationLockDataRepository.courseRegistrationLockData.push(
      courseRegistrationLockData1,
      courseRegistrationLockData2,
      courseRegistrationLockData3,
    );

    const result = await sut.execute({
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'second', year: 2024 },
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseRegistrationLockData: [courseRegistrationLockData3],
      totalItems: 1,
      totalPages: 1,
    });
  });
});
