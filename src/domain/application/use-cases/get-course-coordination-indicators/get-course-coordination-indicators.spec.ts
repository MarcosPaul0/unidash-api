import { InMemoryCourseCoordinationDataRepository } from 'test/repositories/in-memory-course-coordination-data-repository';
import { makeCourseCoordinationData } from 'test/factories/make-course-coordination-data';
import { GetCourseCoordinationIndicatorsUseCase } from './get-course-coordination-indicators';

let inMemoryCourseCoordinationDataRepository: InMemoryCourseCoordinationDataRepository;

let sut: GetCourseCoordinationIndicatorsUseCase;

describe('Find All Course Coordination Indicators', () => {
  beforeEach(() => {
    inMemoryCourseCoordinationDataRepository =
      new InMemoryCourseCoordinationDataRepository();
    sut = new GetCourseCoordinationIndicatorsUseCase(
      inMemoryCourseCoordinationDataRepository,
    );
  });

  it('should be able to find all course coordination indicators with filters', async () => {
    const courseCoordinationData1 = makeCourseCoordinationData({
      semester: 'first',
      year: 2025,
      courseId: 'course-1',
    });
    const courseCoordinationData2 = makeCourseCoordinationData({
      semester: 'second',
      year: 2025,
      courseId: 'course-1',
    });
    const courseCoordinationData3 = makeCourseCoordinationData({
      semester: 'second',
      year: 2024,
      courseId: 'course-1',
    });

    inMemoryCourseCoordinationDataRepository.courseCoordinationData.push(
      courseCoordinationData1,
      courseCoordinationData2,
      courseCoordinationData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      filters: { semester: 'second', year: 2024 },
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual([courseCoordinationData3]);
  });
});
