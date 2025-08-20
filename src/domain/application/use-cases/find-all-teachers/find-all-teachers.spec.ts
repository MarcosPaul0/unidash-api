import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeStudent } from 'test/factories/make-student';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { FindAllTeachersUseCase } from './find-all-teachers';
import { InMemoryTeachersRepository } from 'test/repositories/in-memory-teachers-repository';
import { makeTeacher } from 'test/factories/make-teacher';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let inMemoryTeachersRepository: InMemoryTeachersRepository;
let authorizationService: AuthorizationService;

let sut: FindAllTeachersUseCase;

describe('Find All Teachers', () => {
  beforeEach(() => {
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    inMemoryTeachersRepository = new InMemoryTeachersRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindAllTeachersUseCase(
      inMemoryTeachersRepository,
      authorizationService,
    );
  });

  it('should be able to find all teachers if session user is a admin', async () => {
    const admin = makeAdmin();

    const teacher1 = makeTeacher({}, new UniqueEntityId('teacher-1'));
    const teacher2 = makeTeacher({}, new UniqueEntityId('teacher-2'));
    const teacher3 = makeTeacher({}, new UniqueEntityId('teacher-3'));

    inMemoryTeachersRepository.teachers.push(teacher1, teacher2, teacher3);

    const result = await sut.execute({
      pagination: { page: 1, itemsPerPage: 2 },
      sessionUser: {
        id: admin.id.toString(),
        name: admin.name,
        email: admin.email,
        createdAt: admin.createdAt,
        role: admin.role,
      },
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teachers: [teacher1, teacher2],
      totalItems: 3,
      totalPages: 2,
    });
  });

  it('should not be able to find all teachers if session user is a teacher', async () => {
    const teacher = makeTeacher();

    const result = await sut.execute({
      pagination: { page: 1, itemsPerPage: 2 },
      sessionUser: {
        id: teacher.id.toString(),
        name: teacher.name,
        email: teacher.email,
        createdAt: teacher.createdAt,
        role: teacher.role,
      },
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to find all teachers if session user is a student', async () => {
    const student = makeStudent();

    const result = await sut.execute({
      pagination: { page: 1, itemsPerPage: 2 },
      sessionUser: {
        id: student.id.toString(),
        name: student.name,
        email: student.email,
        createdAt: student.createdAt,
        role: student.role,
      },
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
