import { InMemoryCourseStudentsDataRepository } from 'test/repositories/in-memory-course-students-data-repository';
import { FindAllCourseStudentsDataUseCase } from './find-all-course-students-data';
import { makeCourseStudentsData } from 'test/factories/make-course-students-data';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { makeSessionUser } from 'test/factories/make-session-user';

let inMemoryCourseStudentsDataRepository: InMemoryCourseStudentsDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindAllCourseStudentsDataUseCase;

describe('Find All Course Students Data', () => {
  beforeEach(() => {
    inMemoryCourseStudentsDataRepository =
      new InMemoryCourseStudentsDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindAllCourseStudentsDataUseCase(
      inMemoryCourseStudentsDataRepository,
      authorizationService,
    );
  });

  it('should be able to find all course students data', async () => {
    const admin = makeAdmin();

    const courseStudentsData1 = makeCourseStudentsData({
      courseId: 'course-1',
    });
    const courseStudentsData2 = makeCourseStudentsData({
      courseId: 'course-1',
    });
    const courseStudentsData3 = makeCourseStudentsData({
      courseId: 'course-1',
    });

    inMemoryCourseStudentsDataRepository.courseStudentsData.push(
      courseStudentsData1,
      courseStudentsData2,
      courseStudentsData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'first', year: 2025 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseStudentsData: [courseStudentsData1, courseStudentsData2],
      totalItems: 3,
      totalPages: 2,
    });
  });

  it('should be able to find all course students data with filters', async () => {
    const admin = makeAdmin();

    const courseStudentsData1 = makeCourseStudentsData({
      courseId: 'course-1',
      semester: 'first',
      year: 2025,
    });
    const courseStudentsData2 = makeCourseStudentsData({
      courseId: 'course-1',
      semester: 'second',
      year: 2025,
    });
    const courseStudentsData3 = makeCourseStudentsData({
      courseId: 'course-1',
      semester: 'second',
      year: 2024,
    });

    inMemoryCourseStudentsDataRepository.courseStudentsData.push(
      courseStudentsData1,
      courseStudentsData2,
      courseStudentsData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'second', year: 2024 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseStudentsData: [courseStudentsData3],
      totalItems: 1,
      totalPages: 1,
    });
  });
});
