import { FindAllCourseExtensionActivitiesDataUseCase } from './find-all-course-extension-activities-data';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeSessionUser } from 'test/factories/make-session-user';
import { makeAdmin } from 'test/factories/make-admin';
import { InMemoryCourseExtensionActivitiesDataRepository } from 'test/repositories/in-memory-course-extension-activities-data-repository';
import { makeCourseExtensionActivitiesData } from 'test/factories/make-course-extension-activities-data copy';

let inMemoryCourseExtensionActivitiesDataRepository: InMemoryCourseExtensionActivitiesDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindAllCourseExtensionActivitiesDataUseCase;

describe('Find All Course Extension Activities Data', () => {
  beforeEach(() => {
    inMemoryCourseExtensionActivitiesDataRepository =
      new InMemoryCourseExtensionActivitiesDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindAllCourseExtensionActivitiesDataUseCase(
      inMemoryCourseExtensionActivitiesDataRepository,
      authorizationService,
    );
  });

  it('should be able to find all course extension activities data', async () => {
    const admin = makeAdmin();

    const courseExtensionActivitiesData1 = makeCourseExtensionActivitiesData({
      courseId: 'course-1',
    });
    const courseExtensionActivitiesData2 = makeCourseExtensionActivitiesData({
      courseId: 'course-1',
    });
    const courseExtensionActivitiesData3 = makeCourseExtensionActivitiesData({
      courseId: 'course-1',
    });

    inMemoryCourseExtensionActivitiesDataRepository.courseExtensionActivitiesData.push(
      courseExtensionActivitiesData1,
      courseExtensionActivitiesData2,
      courseExtensionActivitiesData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'first', year: 2025 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseExtensionActivitiesData: [
        courseExtensionActivitiesData1,
        courseExtensionActivitiesData2,
      ],
      totalItems: 3,
      totalPages: 2,
    });
  });

  it('should be able to find all course extension activities data with filters', async () => {
    const admin = makeAdmin();

    const courseExtensionActivitiesData1 = makeCourseExtensionActivitiesData({
      courseId: 'course-1',
      semester: 'first',
      year: 2025,
    });
    const courseExtensionActivitiesData2 = makeCourseExtensionActivitiesData({
      courseId: 'course-1',
      semester: 'second',
      year: 2025,
    });
    const courseExtensionActivitiesData3 = makeCourseExtensionActivitiesData({
      courseId: 'course-1',
      semester: 'second',
      year: 2024,
    });

    inMemoryCourseExtensionActivitiesDataRepository.courseExtensionActivitiesData.push(
      courseExtensionActivitiesData1,
      courseExtensionActivitiesData2,
      courseExtensionActivitiesData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'second', year: 2024 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseExtensionActivitiesData: [courseExtensionActivitiesData3],
      totalItems: 1,
      totalPages: 1,
    });
  });
});
