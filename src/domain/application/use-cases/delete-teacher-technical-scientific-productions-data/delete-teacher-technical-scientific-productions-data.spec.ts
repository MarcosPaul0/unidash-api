import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { DeleteTeacherTechnicalScientificProductionsDataUseCase } from './delete-teacher-technical-scientific-productions-data';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { makeSessionUser } from 'test/factories/make-session-user';
import { InMemoryTeacherTechnicalScientificProductionsDataRepository } from 'test/repositories/in-memory-teacher-technical-scientific-productions-data-repository';
import { makeTeacherTechnicalScientificProductionsData } from 'test/factories/make-teacher-technical-scientific-productions-data';
import { makeTeacher } from 'test/factories/make-teacher';

let inMemoryTeacherTechnicalScientificProductionsDataRepository: InMemoryTeacherTechnicalScientificProductionsDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: DeleteTeacherTechnicalScientificProductionsDataUseCase;

describe('Delete Teacher Technical Scientific Productions Data', () => {
  beforeEach(() => {
    inMemoryTeacherTechnicalScientificProductionsDataRepository =
      new InMemoryTeacherTechnicalScientificProductionsDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new DeleteTeacherTechnicalScientificProductionsDataUseCase(
      inMemoryTeacherTechnicalScientificProductionsDataRepository,
      authorizationService,
    );
  });

  it('should be able to delete teacher technical scientific productions data', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));
    const newTeacherTechnicalScientificProductionsData =
      makeTeacherTechnicalScientificProductionsData(
        {
          teacher,
          teacherId: 'teacher-1',
        },
        new UniqueEntityId('teacherTechnicalScientificProductionsData-1'),
      );

    inMemoryTeacherTechnicalScientificProductionsDataRepository.create(
      newTeacherTechnicalScientificProductionsData,
    );

    const result = await sut.execute({
      teacherTechnicalScientificProductionsDataId:
        'teacherTechnicalScientificProductionsData-1',
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryTeacherTechnicalScientificProductionsDataRepository.teacherTechnicalScientificProductionsData,
    ).toHaveLength(0);
  });

  it('should not be able to delete teacher technical scientific productions data if not exists', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));

    const result = await sut.execute({
      teacherTechnicalScientificProductionsDataId:
        'teacherTechnicalScientificProductionsData-1',
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete teacher technical scientific productions data if session user is student', async () => {
    const studentUser = makeStudent();

    const result = await sut.execute({
      teacherTechnicalScientificProductionsDataId:
        'teacherTechnicalScientificProductionsData-1',
      sessionUser: makeSessionUser(studentUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to delete teacher technical scientific productions data if session user is admin', async () => {
    const admin = makeAdmin();

    const result = await sut.execute({
      teacherTechnicalScientificProductionsDataId:
        'teacherTechnicalScientificProductionsData-1',
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
