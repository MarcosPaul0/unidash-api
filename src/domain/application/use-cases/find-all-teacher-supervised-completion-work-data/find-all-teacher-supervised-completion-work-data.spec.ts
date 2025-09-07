import { FindAllTeacherSupervisedCompletionWorkDataUseCase } from './find-all-teacher-supervised-completion-work-data';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeSessionUser } from 'test/factories/make-session-user';
import { makeAdmin } from 'test/factories/make-admin';
import { makeTeacherSupervisedCompletionWorkData } from 'test/factories/make-teacher-supervised-completion-work-data';
import { InMemoryTeacherSupervisedCompletionWorkDataRepository } from 'test/repositories/in-memory-teacher-supervised-completion-work-data-repository';

let inMemoryTeacherSupervisedCompletionWorkDataRepository: InMemoryTeacherSupervisedCompletionWorkDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindAllTeacherSupervisedCompletionWorkDataUseCase;

describe('Find All Teacher Supervised Completion Work Data', () => {
  beforeEach(() => {
    inMemoryTeacherSupervisedCompletionWorkDataRepository =
      new InMemoryTeacherSupervisedCompletionWorkDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindAllTeacherSupervisedCompletionWorkDataUseCase(
      inMemoryTeacherSupervisedCompletionWorkDataRepository,
      authorizationService,
    );
  });

  it('should be able to find all teacher supervised completion work data', async () => {
    const admin = makeAdmin();

    const teacherSupervisedCompletionWorkData1 =
      makeTeacherSupervisedCompletionWorkData({
        courseId: 'course-1',
      });
    const teacherSupervisedCompletionWorkData2 =
      makeTeacherSupervisedCompletionWorkData({
        courseId: 'course-1',
      });
    const teacherSupervisedCompletionWorkData3 =
      makeTeacherSupervisedCompletionWorkData({
        courseId: 'course-1',
      });

    inMemoryTeacherSupervisedCompletionWorkDataRepository.teacherSupervisedCompletionWorkData.push(
      teacherSupervisedCompletionWorkData1,
      teacherSupervisedCompletionWorkData2,
      teacherSupervisedCompletionWorkData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'first', year: 2025 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teacherSupervisedCompletionWorkData: [
        teacherSupervisedCompletionWorkData1,
        teacherSupervisedCompletionWorkData2,
      ],
      totalItems: 3,
      totalPages: 2,
    });
  });

  it('should be able to find all teacher supervised completion work data with filters', async () => {
    const admin = makeAdmin();

    const teacherSupervisedCompletionWorkData1 =
      makeTeacherSupervisedCompletionWorkData({
        semester: 'first',
        year: 2025,
        courseId: 'course-1',
      });
    const teacherSupervisedCompletionWorkData2 =
      makeTeacherSupervisedCompletionWorkData({
        semester: 'second',
        year: 2025,
        courseId: 'course-1',
      });
    const teacherSupervisedCompletionWorkData3 =
      makeTeacherSupervisedCompletionWorkData({
        semester: 'second',
        year: 2024,
        courseId: 'course-1',
      });

    inMemoryTeacherSupervisedCompletionWorkDataRepository.teacherSupervisedCompletionWorkData.push(
      teacherSupervisedCompletionWorkData1,
      teacherSupervisedCompletionWorkData2,
      teacherSupervisedCompletionWorkData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'second', year: 2024 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teacherSupervisedCompletionWorkData: [
        teacherSupervisedCompletionWorkData3,
      ],
      totalItems: 1,
      totalPages: 1,
    });
  });
});
