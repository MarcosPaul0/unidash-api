import { FindAllCourseTeachingComplementaryActivitiesDataUseCase } from './find-all-course-teaching-complementary-activities-data';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeSessionUser } from 'test/factories/make-session-user';
import { makeAdmin } from 'test/factories/make-admin';
import { InMemoryCourseTeachingComplementaryActivitiesDataRepository } from 'test/repositories/in-memory-course-teaching-complementary-activities-data-repository';
import { makeCourseTeachingComplementaryActivitiesData } from 'test/factories/make-course-teaching-complementary-activities-data';

let inMemoryCourseTeachingComplementaryActivitiesDataRepository: InMemoryCourseTeachingComplementaryActivitiesDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindAllCourseTeachingComplementaryActivitiesDataUseCase;

describe('Find All Course Teaching Complementary Activities Data', () => {
  beforeEach(() => {
    inMemoryCourseTeachingComplementaryActivitiesDataRepository =
      new InMemoryCourseTeachingComplementaryActivitiesDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindAllCourseTeachingComplementaryActivitiesDataUseCase(
      inMemoryCourseTeachingComplementaryActivitiesDataRepository,
      authorizationService,
    );
  });

  it('should be able to find all course teaching complementary activities data', async () => {
    const admin = makeAdmin();

    const courseTeachingComplementaryActivitiesData1 =
      makeCourseTeachingComplementaryActivitiesData({
        courseId: 'course-1',
      });
    const courseTeachingComplementaryActivitiesData2 =
      makeCourseTeachingComplementaryActivitiesData({
        courseId: 'course-1',
      });
    const courseTeachingComplementaryActivitiesData3 =
      makeCourseTeachingComplementaryActivitiesData({
        courseId: 'course-1',
      });

    inMemoryCourseTeachingComplementaryActivitiesDataRepository.courseTeachingComplementaryActivitiesData.push(
      courseTeachingComplementaryActivitiesData1,
      courseTeachingComplementaryActivitiesData2,
      courseTeachingComplementaryActivitiesData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'first', year: 2025 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseTeachingComplementaryActivitiesData: [
        courseTeachingComplementaryActivitiesData1,
        courseTeachingComplementaryActivitiesData2,
      ],
      totalItems: 3,
      totalPages: 2,
    });
  });

  it('should be able to find all course teaching complementary activities data with filters', async () => {
    const admin = makeAdmin();

    const courseTeachingComplementaryActivitiesData1 =
      makeCourseTeachingComplementaryActivitiesData({
        courseId: 'course-1',
        semester: 'first',
        year: 2025,
      });
    const courseTeachingComplementaryActivitiesData2 =
      makeCourseTeachingComplementaryActivitiesData({
        courseId: 'course-1',
        semester: 'second',
        year: 2025,
      });
    const courseTeachingComplementaryActivitiesData3 =
      makeCourseTeachingComplementaryActivitiesData({
        courseId: 'course-1',
        semester: 'second',
        year: 2024,
      });

    inMemoryCourseTeachingComplementaryActivitiesDataRepository.courseTeachingComplementaryActivitiesData.push(
      courseTeachingComplementaryActivitiesData1,
      courseTeachingComplementaryActivitiesData2,
      courseTeachingComplementaryActivitiesData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'second', year: 2024 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseTeachingComplementaryActivitiesData: [
        courseTeachingComplementaryActivitiesData3,
      ],
      totalItems: 1,
      totalPages: 1,
    });
  });
});
