import { DeleteStudentUseCase } from './delete-student';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { makeStudent } from 'test/factories/make-student';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { makeTeacher } from 'test/factories/make-teacher';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: DeleteStudentUseCase;

describe('Delete Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new DeleteStudentUseCase(
      inMemoryStudentsRepository,
      authorizationService,
    );
  });

  it('should be able to delete a student', async () => {
    const adminUser = makeAdmin();
    const newStudent = makeStudent({}, new UniqueEntityId('student-1'));

    inMemoryStudentsRepository.create(newStudent);

    await sut.execute({
      studentId: 'student-1',
      sessionUser: adminUser,
    });

    expect(inMemoryStudentsRepository.items).toHaveLength(0);
  });

  it('should not be possible to delete a student if session user is not admin', async () => {
    const teacherUser = makeTeacher();

    const result = await sut.execute({
      studentId: 'student-2',
      sessionUser: teacherUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be possible to delete a student that does not exist', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      studentId: 'student-2',
      sessionUser: adminUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
