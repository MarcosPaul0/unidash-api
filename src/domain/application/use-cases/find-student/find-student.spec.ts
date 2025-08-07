import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { FindStudentUseCase } from './find-student';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeTeacher } from 'test/factories/make-teacher';
import { makeAdmin } from 'test/factories/make-admin';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindStudentUseCase;

describe('Find Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindStudentUseCase(
      inMemoryStudentsRepository,
      authorizationService,
    );
  });

  it('should be able to find a student', async () => {
    const student = makeStudent({}, new UniqueEntityId('student-1'));

    inMemoryStudentsRepository.create(student);

    const result = await sut.execute({
      sessionUser: student,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      student,
    });
  });

  it('should throw if the student was not found', async () => {
    const student = makeStudent({}, new UniqueEntityId('student-2'));

    const result = await sut.execute({
      sessionUser: student,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should throw if the user is an teacher', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));

    const result = await sut.execute({
      sessionUser: teacher,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should throw if the user is an admin', async () => {
    const admin = makeAdmin({}, new UniqueEntityId('admin-1'));

    const result = await sut.execute({
      sessionUser: admin,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
