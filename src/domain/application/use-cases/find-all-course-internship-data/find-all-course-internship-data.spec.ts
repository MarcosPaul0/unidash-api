import { FindAllCourseInternshipDataUseCase } from './find-all-course-internship-data';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeSessionUser } from 'test/factories/make-session-user';
import { makeAdmin } from 'test/factories/make-admin';
import { InMemoryCourseInternshipDataRepository } from 'test/repositories/in-memory-course-internship-data-repository copy';
import { makeCourseInternshipData } from 'test/factories/make-course-internship-data';

let inMemoryCourseInternshipDataRepository: InMemoryCourseInternshipDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindAllCourseInternshipDataUseCase;

describe('Find All Course Internship Data', () => {
  beforeEach(() => {
    inMemoryCourseInternshipDataRepository =
      new InMemoryCourseInternshipDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindAllCourseInternshipDataUseCase(
      inMemoryCourseInternshipDataRepository,
      authorizationService,
    );
  });

  it('should be able to find all course internship data', async () => {
    const admin = makeAdmin();

    const courseInternshipData1 = makeCourseInternshipData({
      courseId: 'course-1',
    });
    const courseInternshipData2 = makeCourseInternshipData({
      courseId: 'course-1',
    });
    const courseInternshipData3 = makeCourseInternshipData({
      courseId: 'course-1',
    });

    inMemoryCourseInternshipDataRepository.courseInternshipData.push(
      courseInternshipData1,
      courseInternshipData2,
      courseInternshipData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'first', year: 2025 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseInternshipData: [courseInternshipData1, courseInternshipData2],
      totalItems: 3,
      totalPages: 2,
    });
  });

  it('should be able to find all course internship data with filters', async () => {
    const admin = makeAdmin();

    const courseInternshipData1 = makeCourseInternshipData({
      courseId: 'course-1',
      semester: 'first',
      year: 2025,
    });
    const courseInternshipData2 = makeCourseInternshipData({
      courseId: 'course-1',
      semester: 'second',
      year: 2025,
    });
    const courseInternshipData3 = makeCourseInternshipData({
      courseId: 'course-1',
      semester: 'second',
      year: 2024,
    });

    inMemoryCourseInternshipDataRepository.courseInternshipData.push(
      courseInternshipData1,
      courseInternshipData2,
      courseInternshipData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'second', year: 2024 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseInternshipData: [courseInternshipData3],
      totalItems: 1,
      totalPages: 1,
    });
  });
});
