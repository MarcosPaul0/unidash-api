import { InMemoryCourseStudentsDataRepository } from 'test/repositories/in-memory-course-students-data-repository';
import { FindAllCourseStudentsDataUseCase } from './find-all-course-students-data';
import { makeCourseStudentsData } from 'test/factories/make-course-students-data';

let inMemoryCourseStudentsDataRepository: InMemoryCourseStudentsDataRepository;

let sut: FindAllCourseStudentsDataUseCase;

describe('Find All Course Students Data', () => {
  beforeEach(() => {
    inMemoryCourseStudentsDataRepository =
      new InMemoryCourseStudentsDataRepository();
    sut = new FindAllCourseStudentsDataUseCase(
      inMemoryCourseStudentsDataRepository,
    );
  });

  it('should be able to find all course students data', async () => {
    const courseStudentsData1 = makeCourseStudentsData();
    const courseStudentsData2 = makeCourseStudentsData();
    const courseStudentsData3 = makeCourseStudentsData();

    inMemoryCourseStudentsDataRepository.courseStudentsData.push(
      courseStudentsData1,
      courseStudentsData2,
      courseStudentsData3,
    );

    const result = await sut.execute({
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'first', year: 2025 },
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseStudentsData: [courseStudentsData1, courseStudentsData2],
      totalItems: 3,
      totalPages: 2,
    });
  });

  it('should be able to find all course students data with filters', async () => {
    const courseStudentsData1 = makeCourseStudentsData({
      semester: 'first',
      year: 2025,
    });
    const courseStudentsData2 = makeCourseStudentsData({
      semester: 'second',
      year: 2025,
    });
    const courseStudentsData3 = makeCourseStudentsData({
      semester: 'second',
      year: 2024,
    });

    inMemoryCourseStudentsDataRepository.courseStudentsData.push(
      courseStudentsData1,
      courseStudentsData2,
      courseStudentsData3,
    );

    const result = await sut.execute({
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'second', year: 2024 },
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseStudentsData: [courseStudentsData3],
      totalItems: 1,
      totalPages: 1,
    });
  });
});
