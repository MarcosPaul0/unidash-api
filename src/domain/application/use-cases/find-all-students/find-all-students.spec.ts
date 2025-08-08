import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository';
import { FindAllStudentsUseCase } from './find-all-students';
import { makeStudent } from 'test/factories/make-student';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeTeacher } from 'test/factories/make-teacher';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindAllStudentsUseCase;

describe('Find All Students', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindAllStudentsUseCase(
      inMemoryStudentsRepository,
      authorizationService,
    );
  });

  it('should be able to find all students', async () => {
    const teacher = makeTeacher();

    const student1 = makeStudent();
    const student2 = makeStudent();
    const student3 = makeStudent();

    inMemoryStudentsRepository.items.push(student1, student2, student3);

    const result = await sut.execute({
      pagination: { page: 1, itemsPerPage: 2 },
      sessionUser: teacher,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      students: [student1, student2],
      totalItems: 3,
      totalPages: 2,
    });
  });

  it('should throw error if the user is a student', async () => {
    const student = makeStudent();

    const result = await sut.execute({
      sessionUser: student,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
