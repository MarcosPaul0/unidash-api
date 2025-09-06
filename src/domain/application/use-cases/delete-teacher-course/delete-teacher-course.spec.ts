import { DeleteTeacherCourseUseCase } from './delete-teacher-course';
import { makeTeacher } from 'test/factories/make-teacher';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { makeAdmin } from 'test/factories/make-admin';
import { makeSessionUser } from 'test/factories/make-session-user';

let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: DeleteTeacherCourseUseCase;

describe('Delete Teacher', () => {
  beforeEach(() => {
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new DeleteTeacherCourseUseCase(
      inMemoryTeacherCoursesRepository,
      authorizationService,
    );
  });

  it('should be able to delete a teacher course', async () => {
    const admin = makeAdmin();
    const newTeacherCourse = makeTeacherCourse(
      {},
      new UniqueEntityId('teacher-course-1'),
    );

    inMemoryTeacherCoursesRepository.teacherCourses.push(newTeacherCourse);

    await sut.execute({
      teacherCourseId: 'teacher-course-1',
      sessionUser: makeSessionUser(admin),
    });

    expect(inMemoryTeacherCoursesRepository.teacherCourses).toHaveLength(0);
  });

  it('should not be possible to delete a teacher course that does not exist', async () => {
    const admin = makeAdmin();
    const result = await sut.execute({
      teacherCourseId: 'teacher-course-1',
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
