import { InMemoryCourseRegistrationLockDataRepository } from 'test/repositories/in-memory-course-registration-lock-data-repository';
import { FindAllCourseRegistrationLockDataUseCase } from './find-all-course-registration-lock-data';
import { makeCourseRegistrationLockData } from 'test/factories/make-course-registration-lock-data';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { makeSessionUser } from 'test/factories/make-session-user';

let inMemoryCourseRegistrationLockDataRepository: InMemoryCourseRegistrationLockDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindAllCourseRegistrationLockDataUseCase;

describe('Find All Course Registration Lock Data', () => {
  beforeEach(() => {
    inMemoryCourseRegistrationLockDataRepository =
      new InMemoryCourseRegistrationLockDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindAllCourseRegistrationLockDataUseCase(
      inMemoryCourseRegistrationLockDataRepository,
      authorizationService,
    );
  });

  it('should be able to find all course registration lock data', async () => {
    const admin = makeAdmin();

    const courseRegistrationLockData1 = makeCourseRegistrationLockData({
      courseId: 'course-1',
    });
    const courseRegistrationLockData2 = makeCourseRegistrationLockData({
      courseId: 'course-1',
    });
    const courseRegistrationLockData3 = makeCourseRegistrationLockData({
      courseId: 'course-1',
    });

    inMemoryCourseRegistrationLockDataRepository.courseRegistrationLockData.push(
      courseRegistrationLockData1,
      courseRegistrationLockData2,
      courseRegistrationLockData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'first', year: 2025 },
      sessionUser: makeSessionUser(admin),
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
    const admin = makeAdmin();

    const courseRegistrationLockData1 = makeCourseRegistrationLockData({
      courseId: 'course-1',
      semester: 'first',
      year: 2025,
    });
    const courseRegistrationLockData2 = makeCourseRegistrationLockData({
      courseId: 'course-1',
      semester: 'second',
      year: 2025,
    });
    const courseRegistrationLockData3 = makeCourseRegistrationLockData({
      courseId: 'course-1',
      semester: 'second',
      year: 2024,
    });

    inMemoryCourseRegistrationLockDataRepository.courseRegistrationLockData.push(
      courseRegistrationLockData1,
      courseRegistrationLockData2,
      courseRegistrationLockData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'second', year: 2024 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseRegistrationLockData: [courseRegistrationLockData3],
      totalItems: 1,
      totalPages: 1,
    });
  });
});
