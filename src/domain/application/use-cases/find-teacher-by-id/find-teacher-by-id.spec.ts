import { InMemoryTeachersRepository } from 'test/repositories/in-memory-teachers-repository';
import { FindTeacherByIdUseCase } from './find-teacher-by-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeTeacher } from 'test/factories/make-teacher';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryTeachersRepository: InMemoryTeachersRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindTeacherByIdUseCase;

describe('Find Teacher By Id', () => {
  beforeEach(() => {
    inMemoryTeachersRepository = new InMemoryTeachersRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();

    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindTeacherByIdUseCase(
      inMemoryTeachersRepository,
      authorizationService,
    );
  });

  it('should be able to find a teacher by id', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));

    inMemoryTeachersRepository.create(teacher);

    const result = await sut.execute({
      id: 'teacher-1',
      sessionUser: teacher,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teacher,
    });
  });

  it('should throw if the teacher was not found', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));

    const result = await sut.execute({
      id: 'teacher-2',
      sessionUser: teacher,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should throw if the user is not an teacher', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));

    const result = await sut.execute({
      id: 'teacher-1',
      sessionUser: teacher,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should throw if the session user is not an teacher', async () => {
    const student = makeStudent({}, new UniqueEntityId('student-1'));

    const result = await sut.execute({
      id: 'teacher-1',
      sessionUser: student,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
