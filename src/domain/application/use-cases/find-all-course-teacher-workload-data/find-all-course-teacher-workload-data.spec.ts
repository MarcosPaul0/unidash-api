import { FindAllCourseTeacherWorkloadDataUseCase } from './find-all-course-teacher-workload-data';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeSessionUser } from 'test/factories/make-session-user';
import { makeAdmin } from 'test/factories/make-admin';
import { InMemoryCourseTeacherWorkloadDataRepository } from 'test/repositories/in-memory-course-teacher-workload-data-repository';
import { makeCourseTeacherWorkloadData } from 'test/factories/make-course-teacher-workload-data';

let inMemoryCourseTeacherWorkloadDataRepository: InMemoryCourseTeacherWorkloadDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindAllCourseTeacherWorkloadDataUseCase;

describe('Find All Course Teacher Workload Data', () => {
  beforeEach(() => {
    inMemoryCourseTeacherWorkloadDataRepository =
      new InMemoryCourseTeacherWorkloadDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindAllCourseTeacherWorkloadDataUseCase(
      inMemoryCourseTeacherWorkloadDataRepository,
      authorizationService,
    );
  });

  it('should be able to find all course TeacherWorkload data', async () => {
    const admin = makeAdmin();

    const courseTeacherWorkloadData1 = makeCourseTeacherWorkloadData({
      courseId: 'course-1',
    });
    const courseTeacherWorkloadData2 = makeCourseTeacherWorkloadData({
      courseId: 'course-1',
    });
    const courseTeacherWorkloadData3 = makeCourseTeacherWorkloadData({
      courseId: 'course-1',
    });

    inMemoryCourseTeacherWorkloadDataRepository.courseTeacherWorkloadData.push(
      courseTeacherWorkloadData1,
      courseTeacherWorkloadData2,
      courseTeacherWorkloadData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'first', year: 2025 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseTeacherWorkloadData: [
        courseTeacherWorkloadData1,
        courseTeacherWorkloadData2,
      ],
      totalItems: 3,
      totalPages: 2,
    });
  });

  it('should be able to find all course TeacherWorkload data with filters', async () => {
    const admin = makeAdmin();

    const courseTeacherWorkloadData1 = makeCourseTeacherWorkloadData({
      courseId: 'course-1',
      semester: 'first',
      year: 2025,
    });
    const courseTeacherWorkloadData2 = makeCourseTeacherWorkloadData({
      courseId: 'course-1',
      semester: 'second',
      year: 2025,
    });
    const courseTeacherWorkloadData3 = makeCourseTeacherWorkloadData({
      courseId: 'course-1',
      semester: 'second',
      year: 2024,
    });

    inMemoryCourseTeacherWorkloadDataRepository.courseTeacherWorkloadData.push(
      courseTeacherWorkloadData1,
      courseTeacherWorkloadData2,
      courseTeacherWorkloadData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'second', year: 2024 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseTeacherWorkloadData: [courseTeacherWorkloadData3],
      totalItems: 1,
      totalPages: 1,
    });
  });
});
