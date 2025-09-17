import { FindAllCourseSearchComplementaryActivitiesDataUseCase } from './find-all-course-search-complementary-activities-data';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeSessionUser } from 'test/factories/make-session-user';
import { makeAdmin } from 'test/factories/make-admin';
import { makeCourseSearchComplementaryActivitiesData } from 'test/factories/make-course-search-complementary-activities-data';
import { InMemoryCourseSearchComplementaryActivitiesDataRepository } from 'test/repositories/in-memory-course-search-complementary-activities-data-repository';

let inMemoryCourseSearchComplementaryActivitiesDataRepository: InMemoryCourseSearchComplementaryActivitiesDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindAllCourseSearchComplementaryActivitiesDataUseCase;

describe('Find All Course Search Complementary Activities Data', () => {
  beforeEach(() => {
    inMemoryCourseSearchComplementaryActivitiesDataRepository =
      new InMemoryCourseSearchComplementaryActivitiesDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindAllCourseSearchComplementaryActivitiesDataUseCase(
      inMemoryCourseSearchComplementaryActivitiesDataRepository,
      authorizationService,
    );
  });

  it('should be able to find all course search complementary activities data', async () => {
    const admin = makeAdmin();

    const courseSearchComplementaryActivitiesData1 =
      makeCourseSearchComplementaryActivitiesData({
        courseId: 'course-1',
      });
    const courseSearchComplementaryActivitiesData2 =
      makeCourseSearchComplementaryActivitiesData({
        courseId: 'course-1',
      });
    const courseSearchComplementaryActivitiesData3 =
      makeCourseSearchComplementaryActivitiesData({
        courseId: 'course-1',
      });

    inMemoryCourseSearchComplementaryActivitiesDataRepository.courseSearchComplementaryActivitiesData.push(
      courseSearchComplementaryActivitiesData1,
      courseSearchComplementaryActivitiesData2,
      courseSearchComplementaryActivitiesData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'first', year: 2025 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseSearchComplementaryActivitiesData: [
        courseSearchComplementaryActivitiesData1,
        courseSearchComplementaryActivitiesData2,
      ],
      totalItems: 3,
      totalPages: 2,
    });
  });

  it('should be able to find all course search complementary activities data with filters', async () => {
    const admin = makeAdmin();

    const courseSearchComplementaryActivitiesData1 =
      makeCourseSearchComplementaryActivitiesData({
        courseId: 'course-1',
        semester: 'first',
        year: 2025,
      });
    const courseSearchComplementaryActivitiesData2 =
      makeCourseSearchComplementaryActivitiesData({
        courseId: 'course-1',
        semester: 'second',
        year: 2025,
      });
    const courseSearchComplementaryActivitiesData3 =
      makeCourseSearchComplementaryActivitiesData({
        courseId: 'course-1',
        semester: 'second',
        year: 2024,
      });

    inMemoryCourseSearchComplementaryActivitiesDataRepository.courseSearchComplementaryActivitiesData.push(
      courseSearchComplementaryActivitiesData1,
      courseSearchComplementaryActivitiesData2,
      courseSearchComplementaryActivitiesData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'second', year: 2024 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseSearchComplementaryActivitiesData: [
        courseSearchComplementaryActivitiesData3,
      ],
      totalItems: 1,
      totalPages: 1,
    });
  });
});
