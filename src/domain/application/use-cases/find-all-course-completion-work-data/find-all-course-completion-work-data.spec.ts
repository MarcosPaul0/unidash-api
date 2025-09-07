import { FindAllCourseCompletionWorkDataUseCase } from './find-all-course-completion-work-data';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeSessionUser } from 'test/factories/make-session-user';
import { makeAdmin } from 'test/factories/make-admin';
import { InMemoryCourseCompletionWorkDataRepository } from 'test/repositories/in-memory-course-completion-work-data-repository';
import { makeCourseCompletionWorkData } from 'test/factories/make-course-completion-work-data';

let inMemoryCourseCompletionWorkDataRepository: InMemoryCourseCompletionWorkDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindAllCourseCompletionWorkDataUseCase;

describe('Find All Course Completion Work Data', () => {
  beforeEach(() => {
    inMemoryCourseCompletionWorkDataRepository =
      new InMemoryCourseCompletionWorkDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindAllCourseCompletionWorkDataUseCase(
      inMemoryCourseCompletionWorkDataRepository,
      authorizationService,
    );
  });

  it('should be able to find all course completion work data', async () => {
    const admin = makeAdmin();

    const courseCompletionWorkData1 = makeCourseCompletionWorkData({
      courseId: 'course-1',
    });
    const courseCompletionWorkData2 = makeCourseCompletionWorkData({
      courseId: 'course-1',
    });
    const courseCompletionWorkData3 = makeCourseCompletionWorkData({
      courseId: 'course-1',
    });

    inMemoryCourseCompletionWorkDataRepository.courseCompletionWorkData.push(
      courseCompletionWorkData1,
      courseCompletionWorkData2,
      courseCompletionWorkData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'first', year: 2025 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseCompletionWorkData: [
        courseCompletionWorkData1,
        courseCompletionWorkData2,
      ],
      totalItems: 3,
      totalPages: 2,
    });
  });

  it('should be able to find all course completion work data with filters', async () => {
    const admin = makeAdmin();

    const courseCompletionWorkData1 = makeCourseCompletionWorkData({
      semester: 'first',
      year: 2025,
      courseId: 'course-1',
    });
    const courseCompletionWorkData2 = makeCourseCompletionWorkData({
      semester: 'second',
      year: 2025,
      courseId: 'course-1',
    });
    const courseCompletionWorkData3 = makeCourseCompletionWorkData({
      semester: 'second',
      year: 2024,
      courseId: 'course-1',
    });

    inMemoryCourseCompletionWorkDataRepository.courseCompletionWorkData.push(
      courseCompletionWorkData1,
      courseCompletionWorkData2,
      courseCompletionWorkData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'second', year: 2024 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseCompletionWorkData: [courseCompletionWorkData3],
      totalItems: 1,
      totalPages: 1,
    });
  });
});
