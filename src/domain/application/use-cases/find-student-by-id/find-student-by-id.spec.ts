import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository';
import { FindStudentByIdUseCase } from './find-student-by-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeTeacher } from 'test/factories/make-teacher';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindStudentByIdUseCase;

describe('Find Student By Id', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindStudentByIdUseCase(
      inMemoryStudentsRepository,
      authorizationService,
    );
  });

  it('should be able to find a student by id', async () => {
    const student = makeStudent({}, new UniqueEntityId('student-1'));
    const teacher = makeTeacher();

    inMemoryStudentsRepository.create(student);

    const result = await sut.execute({
      studentId: 'student-1',
      sessionUser: teacher,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      student,
    });
  });

  it('should throw if the student was not found', async () => {
    const teacher = makeTeacher();

    const result = await sut.execute({
      studentId: 'student-2',
      sessionUser: teacher,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should throw if the user is not an teacher and admin', async () => {
    const student = makeStudent();

    const result = await sut.execute({
      studentId: 'student-1',
      sessionUser: student,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
