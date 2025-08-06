import { InMemoryTeachersRepository } from 'test/repositories/in-memory-teachers-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { UpdateTeacherData, UpdateTeacherUseCase } from './update-teacher';
import { makeTeacher } from 'test/factories/make-teacher';

let inMemoryTeacherRepository: InMemoryTeachersRepository;

let sut: UpdateTeacherUseCase;

describe('Update Teacher', () => {
  beforeEach(() => {
    inMemoryTeacherRepository = new InMemoryTeachersRepository();

    sut = new UpdateTeacherUseCase(inMemoryTeacherRepository);
  });

  it('should be able to update teacher', async () => {
    const teacher = makeTeacher({
      name: 'John Doe',
      email: 'johnDoe@example.com',
      password: '123456',
    });

    inMemoryTeacherRepository.teachers.push(teacher);

    const data: UpdateTeacherData = {
      name: 'John Doe Doe',
    };

    const result = await sut.execute({
      teacherId: teacher.id.toString(),
      data,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryTeacherRepository.teachers[0].name).toEqual('John Doe Doe');
  });

  it('should not be able to update teacher if the teacher was not found', async () => {
    const data: UpdateTeacherData = {
      name: 'John Doe',
    };

    const result = await sut.execute({
      teacherId: 'fakeId',
      data,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });
});
