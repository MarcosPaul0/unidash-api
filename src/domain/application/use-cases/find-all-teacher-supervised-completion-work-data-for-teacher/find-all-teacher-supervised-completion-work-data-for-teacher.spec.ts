import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeSessionUser } from 'test/factories/make-session-user';
import { makeTeacherSupervisedCompletionWorkData } from 'test/factories/make-teacher-supervised-completion-work-data';
import { InMemoryTeacherSupervisedCompletionWorkDataRepository } from 'test/repositories/in-memory-teacher-supervised-completion-work-data-repository';
import { FindAllTeacherSupervisedCompletionWorkDataForTeacherUseCase } from './find-all-teacher-supervised-completion-work-data-for-teacher';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeTeacher } from 'test/factories/make-teacher';

let inMemoryTeacherSupervisedCompletionWorkDataRepository: InMemoryTeacherSupervisedCompletionWorkDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindAllTeacherSupervisedCompletionWorkDataForTeacherUseCase;

describe('Find All Teacher Supervised Completion Work Data For Teacher', () => {
  beforeEach(() => {
    inMemoryTeacherSupervisedCompletionWorkDataRepository =
      new InMemoryTeacherSupervisedCompletionWorkDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindAllTeacherSupervisedCompletionWorkDataForTeacherUseCase(
      inMemoryTeacherSupervisedCompletionWorkDataRepository,
      authorizationService,
    );
  });

  it('should be able to find all teacher supervised completion work data', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));

    const teacherSupervisedCompletionWorkData1 =
      makeTeacherSupervisedCompletionWorkData({
        courseId: 'course-1',
        teacherId: 'teacher-1',
      });
    const teacherSupervisedCompletionWorkData2 =
      makeTeacherSupervisedCompletionWorkData({
        courseId: 'course-1',
        teacherId: 'teacher-1',
      });
    const teacherSupervisedCompletionWorkData3 =
      makeTeacherSupervisedCompletionWorkData({
        courseId: 'course-1',
        teacherId: 'teacher-1',
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
      sessionUser: makeSessionUser(teacher),
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
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));

    const teacherSupervisedCompletionWorkData1 =
      makeTeacherSupervisedCompletionWorkData({
        semester: 'first',
        year: 2025,
        courseId: 'course-1',
        teacherId: 'teacher-1',
      });
    const teacherSupervisedCompletionWorkData2 =
      makeTeacherSupervisedCompletionWorkData({
        semester: 'second',
        year: 2025,
        courseId: 'course-1',
        teacherId: 'teacher-1',
      });
    const teacherSupervisedCompletionWorkData3 =
      makeTeacherSupervisedCompletionWorkData({
        semester: 'second',
        year: 2024,
        courseId: 'course-1',
        teacherId: 'teacher-1',
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
      sessionUser: makeSessionUser(teacher),
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
