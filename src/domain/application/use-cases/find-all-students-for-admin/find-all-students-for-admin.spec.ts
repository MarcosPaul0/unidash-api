import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository';
import { FindAllStudentsForAdminUseCase } from './find-all-students-for-admin';
import { makeStudent } from 'test/factories/make-student';

let inMemoryStudentsRepository: InMemoryStudentsRepository;

let sut: FindAllStudentsForAdminUseCase;

describe('Find All Students For Admin', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    sut = new FindAllStudentsForAdminUseCase(inMemoryStudentsRepository);
  });

  it('should be able to find all students for admin', async () => {
    const student1 = makeStudent();
    const student2 = makeStudent();
    const student3 = makeStudent();

    inMemoryStudentsRepository.items.push(student1, student2, student3);

    const result = await sut.execute({
      userRole: 'admin',
      pagination: { page: 1, itemsPerPage: 2 },
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      students: [student1, student2],
      totalItems: 3,
      totalPages: 2,
    });
  });

  it('should throw error if the user is not an admin', async () => {
    const result = await sut.execute({
      userRole: 'teacher',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
