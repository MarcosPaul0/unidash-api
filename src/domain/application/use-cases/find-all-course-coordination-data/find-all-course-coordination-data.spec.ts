import { InMemoryCourseCoordinationDataRepository } from 'test/repositories/in-memory-course-coordination-data-repository';
import { FindAllCourseCoordinationDataUseCase } from './find-all-course-coordination-data';
import { makeCourseCoordinationData } from 'test/factories/make-course-coordination-data';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeSessionUser } from 'test/factories/make-session-user';
import { makeAdmin } from 'test/factories/make-admin';

let inMemoryCourseCoordinationDataRepository: InMemoryCourseCoordinationDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindAllCourseCoordinationDataUseCase;

describe('Find All Course Coordination Data', () => {
  beforeEach(() => {
    inMemoryCourseCoordinationDataRepository =
      new InMemoryCourseCoordinationDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindAllCourseCoordinationDataUseCase(
      inMemoryCourseCoordinationDataRepository,
      authorizationService,
    );
  });

  it('should be able to find all course coordination data', async () => {
    const admin = makeAdmin();

    const courseCoordinationData1 = makeCourseCoordinationData({
      courseId: 'course-1',
    });
    const courseCoordinationData2 = makeCourseCoordinationData({
      courseId: 'course-1',
    });
    const courseCoordinationData3 = makeCourseCoordinationData({
      courseId: 'course-1',
    });

    inMemoryCourseCoordinationDataRepository.courseCoordinationData.push(
      courseCoordinationData1,
      courseCoordinationData2,
      courseCoordinationData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'first', year: 2025 },
      sessionUser: makeSessionUser(admin),
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
    const admin = makeAdmin();

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
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'second', year: 2024 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseCoordinationData: [courseCoordinationData3],
      totalItems: 1,
      totalPages: 1,
    });
  });
});
