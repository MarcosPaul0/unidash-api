import { DeleteTeacherUseCase } from './delete-teacher';
import { InMemoryTeachersRepository } from 'test/repositories/in-memory-teachers-repository';
import { makeTeacher } from 'test/factories/make-teacher';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { makeSessionUser } from 'test/factories/make-session-user';

let inMemoryTeachersRepository: InMemoryTeachersRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: DeleteTeacherUseCase;

describe('Delete Teacher', () => {
  beforeEach(() => {
    inMemoryTeachersRepository = new InMemoryTeachersRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new DeleteTeacherUseCase(
      inMemoryTeachersRepository,
      authorizationService,
    );
  });

  it('should be able to delete a teacher', async () => {
    const admin = makeAdmin();
    const newTeacher = makeTeacher({}, new UniqueEntityId('teacher-1'));

    inMemoryTeachersRepository.create(newTeacher);

    await sut.execute({
      teacherId: 'teacher-1',
      sessionUser: makeSessionUser(admin),
    });

    expect(inMemoryTeachersRepository.teachers).toHaveLength(0);
  });

  it('should not be possible to delete a teacher that does not exist', async () => {
    const admin = makeAdmin();

    const result = await sut.execute({
      teacherId: 'teacher-2',
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
