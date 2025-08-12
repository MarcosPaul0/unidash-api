import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';
import { DeleteCourseUseCase } from './delete-course';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { makeCourse } from 'test/factories/make-course';
import { makeTeacher } from 'test/factories/make-teacher';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryCoursesRepository: InMemoryCoursesRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: DeleteCourseUseCase;

describe('Delete Course', () => {
  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new DeleteCourseUseCase(
      inMemoryCoursesRepository,
      authorizationService,
    );
  });

  it('should be able to delete a course', async () => {
    const adminUser = makeAdmin();
    const newCourse = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(newCourse);

    await sut.execute({
      courseId: 'course-1',
      sessionUser: adminUser,
    });

    expect(inMemoryCoursesRepository.courses).toHaveLength(0);
  });

  it('should not be possible to delete a course that does not exist', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseId: 'course-2',
      sessionUser: adminUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be possible to delete a course if session user is not admin', async () => {
    const teacherUser = makeTeacher();

    const result = await sut.execute({
      courseId: 'course-2',
      sessionUser: teacherUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
