import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { DeleteTeacherSupervisedCompletionWorkDataUseCase } from './delete-teacher-supervised-completion-work-data';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { makeTeacherSupervisedCompletionWorkData } from 'test/factories/make-teacher-supervised-completion-work-data';
import { InMemoryTeacherSupervisedCompletionWorkDataRepository } from 'test/repositories/in-memory-teacher-supervised-completion-work-data-repository';
import { makeSessionUser } from 'test/factories/make-session-user';

let inMemoryTeacherSupervisedCompletionWorkDataRepository: InMemoryTeacherSupervisedCompletionWorkDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: DeleteTeacherSupervisedCompletionWorkDataUseCase;

describe('Delete Teacher Supervised Completion Work Data', () => {
  beforeEach(() => {
    inMemoryTeacherSupervisedCompletionWorkDataRepository =
      new InMemoryTeacherSupervisedCompletionWorkDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new DeleteTeacherSupervisedCompletionWorkDataUseCase(
      inMemoryTeacherSupervisedCompletionWorkDataRepository,
      authorizationService,
    );
  });

  it('should be able to delete teacher supervised completion work data', async () => {
    const adminUser = makeAdmin();
    const newTeacherSupervisedCompletionWorkData =
      makeTeacherSupervisedCompletionWorkData(
        {},
        new UniqueEntityId('teacherSupervisedCompletionWorkData-1'),
      );

    inMemoryTeacherSupervisedCompletionWorkDataRepository.create(
      newTeacherSupervisedCompletionWorkData,
    );

    const result = await sut.execute({
      teacherSupervisedCompletionWorkDataId:
        'teacherSupervisedCompletionWorkData-1',
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryTeacherSupervisedCompletionWorkDataRepository.teacherSupervisedCompletionWorkData,
    ).toHaveLength(0);
  });

  it('should not be able to delete teacher supervised completion work data if not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      teacherSupervisedCompletionWorkDataId:
        'teacherSupervisedCompletionWorkData-1',
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete teacher supervised completion work data if session user is student', async () => {
    const studentUser = makeStudent();
    const newTeacherSupervisedCompletionWorkData =
      makeTeacherSupervisedCompletionWorkData(
        {},
        new UniqueEntityId('teacherSupervisedCompletionWorkData-1'),
      );

    inMemoryTeacherSupervisedCompletionWorkDataRepository.create(
      newTeacherSupervisedCompletionWorkData,
    );

    const result = await sut.execute({
      teacherSupervisedCompletionWorkDataId:
        'teacherSupervisedCompletionWorkData-1',
      sessionUser: makeSessionUser(studentUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to delete teacher supervised completion work data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const newTeacherSupervisedCompletionWorkData =
      makeTeacherSupervisedCompletionWorkData(
        {},
        new UniqueEntityId('teacherSupervisedCompletionWorkData-1'),
      );

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryTeacherSupervisedCompletionWorkDataRepository.create(
      newTeacherSupervisedCompletionWorkData,
    );

    const result = await sut.execute({
      teacherSupervisedCompletionWorkDataId:
        'teacherSupervisedCompletionWorkData-1',
      sessionUser: makeSessionUser(teacherCourse.teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
