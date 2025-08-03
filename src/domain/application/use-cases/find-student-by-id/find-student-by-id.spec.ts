import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository';
import { FindStudentByIdUseCase } from './find-student-by-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryStudentsRepository: InMemoryStudentsRepository;

let sut: FindStudentByIdUseCase;

describe('Find Student By Id', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    sut = new FindStudentByIdUseCase(inMemoryStudentsRepository);
  });

  it('should be able to find a student by id', async () => {
    const student = makeStudent({}, new UniqueEntityId('student-1'));

    inMemoryStudentsRepository.create(student);

    const result = await sut.execute({
      id: 'student-1',
      userRole: 'student',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      student,
    });
  });

  it('should throw if the student was not found', async () => {
    const result = await sut.execute({
      id: 'student-2',
      userRole: 'student',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should throw if the user is not an student', async () => {
    const result = await sut.execute({
      id: 'student-1',
      userRole: 'teacher',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
