import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { DeleteTeacherResearchAndExtensionProjectsDataUseCase } from './delete-teacher-research-and-extension-projects-data';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeSessionUser } from 'test/factories/make-session-user';
import { InMemoryTeacherResearchAndExtensionProjectsDataRepository } from 'test/repositories/in-memory-teacher-research-and-extension-projects-data-repository';
import { makeTeacherResearchAndExtensionProjectsData } from 'test/factories/make-teacher-research-and-extension-projects-data';
import { makeTeacher } from 'test/factories/make-teacher';
import { makeAdmin } from 'test/factories/make-admin';

let inMemoryTeacherResearchAndExtensionProjectsDataRepository: InMemoryTeacherResearchAndExtensionProjectsDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: DeleteTeacherResearchAndExtensionProjectsDataUseCase;

describe('Delete Teacher Research And Extension Projects Data', () => {
  beforeEach(() => {
    inMemoryTeacherResearchAndExtensionProjectsDataRepository =
      new InMemoryTeacherResearchAndExtensionProjectsDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new DeleteTeacherResearchAndExtensionProjectsDataUseCase(
      inMemoryTeacherResearchAndExtensionProjectsDataRepository,
      authorizationService,
    );
  });

  it('should be able to delete teacher research and extension projects data', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));
    const newTeacherResearchAndExtensionProjectsData =
      makeTeacherResearchAndExtensionProjectsData(
        {
          teacher,
          teacherId: 'teacher-1',
        },
        new UniqueEntityId('teacherResearchAndExtensionProjectsData-1'),
      );

    inMemoryTeacherResearchAndExtensionProjectsDataRepository.create(
      newTeacherResearchAndExtensionProjectsData,
    );

    const result = await sut.execute({
      teacherResearchAndExtensionProjectsDataId:
        'teacherResearchAndExtensionProjectsData-1',
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryTeacherResearchAndExtensionProjectsDataRepository.teacherResearchAndExtensionProjectsData,
    ).toHaveLength(0);
  });

  it('should not be able to delete teacher research and extension projects data if not exists', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));

    const result = await sut.execute({
      teacherResearchAndExtensionProjectsDataId:
        'teacherResearchAndExtensionProjectsData-1',
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete teacher research and extension projects data if session user is student', async () => {
    const studentUser = makeStudent();

    const result = await sut.execute({
      teacherResearchAndExtensionProjectsDataId:
        'teacherResearchAndExtensionProjectsData-1',
      sessionUser: makeSessionUser(studentUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to delete teacher research and extension projects data if session user is admin', async () => {
    const admin = makeAdmin();

    const result = await sut.execute({
      teacherResearchAndExtensionProjectsDataId:
        'teacherResearchAndExtensionProjectsData-1',
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
