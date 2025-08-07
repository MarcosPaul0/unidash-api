import { InMemoryTeachersRepository } from 'test/repositories/in-memory-teachers-repository';
import { FindTeacherUseCase } from './find-teacher';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeTeacher } from 'test/factories/make-teacher';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeAdmin } from 'test/factories/make-admin';

let inMemoryTeachersRepository: InMemoryTeachersRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindTeacherUseCase;

describe('Find Teacher', () => {
  beforeEach(() => {
    inMemoryTeachersRepository = new InMemoryTeachersRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();

    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindTeacherUseCase(
      inMemoryTeachersRepository,
      authorizationService,
    );
  });

  it('should be able to find a teacher', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));

    inMemoryTeachersRepository.create(teacher);

    const result = await sut.execute({
      sessionUser: teacher,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teacher,
    });
  });

  it('should throw if the teacher was not found', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-2'));

    const result = await sut.execute({
      sessionUser: teacher,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should throw if the session user is an student', async () => {
    const student = makeStudent({}, new UniqueEntityId('student-1'));

    const result = await sut.execute({
      sessionUser: student,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should throw if the session user is an admin', async () => {
    const admin = makeAdmin({}, new UniqueEntityId('admin-1'));

    const result = await sut.execute({
      sessionUser: admin,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
