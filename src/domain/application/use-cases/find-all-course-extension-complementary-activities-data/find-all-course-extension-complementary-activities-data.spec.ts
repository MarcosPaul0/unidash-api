import { FindAllCourseExtensionComplementaryActivitiesDataUseCase } from './find-all-course-extension-complementary-activities-data';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeSessionUser } from 'test/factories/make-session-user';
import { makeAdmin } from 'test/factories/make-admin';
import { InMemoryCourseExtensionComplementaryActivitiesDataRepository } from 'test/repositories/in-memory-course-extension-complementary-activities-data-repository';
import { makeCourseExtensionComplementaryActivitiesData } from 'test/factories/make-course-extension-complementary-activities-data';

let inMemoryCourseExtensionComplementaryActivitiesDataRepository: InMemoryCourseExtensionComplementaryActivitiesDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindAllCourseExtensionComplementaryActivitiesDataUseCase;

describe('Find All Course Extension Complementary Activities Data', () => {
  beforeEach(() => {
    inMemoryCourseExtensionComplementaryActivitiesDataRepository =
      new InMemoryCourseExtensionComplementaryActivitiesDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindAllCourseExtensionComplementaryActivitiesDataUseCase(
      inMemoryCourseExtensionComplementaryActivitiesDataRepository,
      authorizationService,
    );
  });

  it('should be able to find all course extension complementary activities data', async () => {
    const admin = makeAdmin();

    const courseExtensionComplementaryActivitiesData1 =
      makeCourseExtensionComplementaryActivitiesData({
        courseId: 'course-1',
      });
    const courseExtensionComplementaryActivitiesData2 =
      makeCourseExtensionComplementaryActivitiesData({
        courseId: 'course-1',
      });
    const courseExtensionComplementaryActivitiesData3 =
      makeCourseExtensionComplementaryActivitiesData({
        courseId: 'course-1',
      });

    inMemoryCourseExtensionComplementaryActivitiesDataRepository.courseExtensionComplementaryActivitiesData.push(
      courseExtensionComplementaryActivitiesData1,
      courseExtensionComplementaryActivitiesData2,
      courseExtensionComplementaryActivitiesData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'first', year: 2025 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseExtensionComplementaryActivitiesData: [
        courseExtensionComplementaryActivitiesData1,
        courseExtensionComplementaryActivitiesData2,
      ],
      totalItems: 3,
      totalPages: 2,
    });
  });

  it('should be able to find all course extension complementary activities data with filters', async () => {
    const admin = makeAdmin();

    const courseExtensionComplementaryActivitiesData1 =
      makeCourseExtensionComplementaryActivitiesData({
        courseId: 'course-1',
        semester: 'first',
        year: 2025,
      });
    const courseExtensionComplementaryActivitiesData2 =
      makeCourseExtensionComplementaryActivitiesData({
        courseId: 'course-1',
        semester: 'second',
        year: 2025,
      });
    const courseExtensionComplementaryActivitiesData3 =
      makeCourseExtensionComplementaryActivitiesData({
        courseId: 'course-1',
        semester: 'second',
        year: 2024,
      });

    inMemoryCourseExtensionComplementaryActivitiesDataRepository.courseExtensionComplementaryActivitiesData.push(
      courseExtensionComplementaryActivitiesData1,
      courseExtensionComplementaryActivitiesData2,
      courseExtensionComplementaryActivitiesData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'second', year: 2024 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseExtensionComplementaryActivitiesData: [
        courseExtensionComplementaryActivitiesData3,
      ],
      totalItems: 1,
      totalPages: 1,
    });
  });
});
